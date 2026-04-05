// server.cjs
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== CONFIGURATION ====================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Création des dossiers d'upload
const uploadDirs = ['uploads/articles', 'uploads/galerie', 'uploads/ressources'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuration Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.url.includes('/articles')) cb(null, 'uploads/articles/');
        else if (req.url.includes('/galerie')) cb(null, 'uploads/galerie/');
        else if (req.url.includes('/ressources')) cb(null, 'uploads/ressources/');
        else cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadMultiple = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// ==================== CONNEXION MYSQL ====================
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'eedc_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==================== MIDDLEWARES ====================
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Non authentifié' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eedc_secret_key_2025');
        const [users] = await pool.query(
            'SELECT id, uuid, email, nom, prenom, role, statut FROM users WHERE id = ? AND statut = "actif"',
            [decoded.userId]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        
        req.user = users[0];
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalide' });
    }
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non authentifié' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }
        next();
    };
};

// ==================== AUTHENTIFICATION ====================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        
        const user = users[0];
        
        if (user.statut !== 'actif') {
            return res.status(403).json({ message: 'Compte désactivé' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        
        await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
        
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'eedc_secret_key_2025',
            { expiresIn: '7d' }
        );
        
        const { password_hash: _, ...userWithoutPassword } = user;
        
        res.json({ token, user: userWithoutPassword });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== INSCRIPTIONS (DEMANDES D'ADHÉSION) ====================
app.post('/api/inscriptions', async (req, res) => {
    try {
        const { nom, prenom, email, telephone, date_naissance, branche_souhaitee, region, unite_souhaitee, message } = req.body;
        
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        const [existingInscription] = await pool.query(
            'SELECT id FROM inscriptions WHERE email = ? AND statut = "en_attente"',
            [email]
        );
        if (existingInscription.length > 0) {
            return res.status(400).json({ message: 'Vous avez déjà une demande en attente' });
        }
        
        await pool.query(
            `INSERT INTO inscriptions (nom, prenom, email, telephone, date_naissance, branche_souhaitee, region, unite_souhaitee, message)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom, prenom, email, telephone, date_naissance, branche_souhaitee, region, unite_souhaitee, message]
        );
        
        res.status(201).json({ message: 'Votre demande a été envoyée avec succès.' });
        
    } catch (error) {
        console.error('Inscription error:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

app.get('/api/admin/inscriptions', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const [inscriptions] = await pool.query(
            `SELECT i.*, u.nom as traite_par_nom, u.prenom as traite_par_prenom
             FROM inscriptions i
             LEFT JOIN users u ON i.traitee_par = u.id
             ORDER BY i.created_at DESC`
        );
        res.json(inscriptions);
    } catch (error) {
        console.error('Get inscriptions error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/admin/inscriptions/:id/valider', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const inscriptionId = req.params.id;
        const { role, branche, unite, region, telephone } = req.body;
        
        const [inscriptions] = await pool.query(
            'SELECT * FROM inscriptions WHERE id = ? AND statut = "en_attente"',
            [inscriptionId]
        );
        
        if (inscriptions.length === 0) {
            return res.status(404).json({ message: 'Inscription non trouvée' });
        }
        
        const inscription = inscriptions[0];
        
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        await pool.query(
            `INSERT INTO invitations (token, email, nom, prenom, role, branche, unite, region, telephone, invite_par, expires_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [token, inscription.email, inscription.nom, inscription.prenom, role, branche, unite, region, telephone || inscription.telephone, req.user.id, expiresAt]
        );
        
        await pool.query(
            'UPDATE inscriptions SET statut = "invitee", traitee_par = ?, traitee_le = NOW() WHERE id = ?',
            [req.user.id, inscriptionId]
        );
        
        const invitationLink = `http://localhost:5173/creer-compte/${token}`;
        
        res.json({
            message: 'Inscription validée avec succès',
            invitationLink: invitationLink,
            token: token
        });
        
    } catch (error) {
        console.error('Validate inscription error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/admin/inscriptions/:id/rejeter', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const inscriptionId = req.params.id;
        
        await pool.query(
            'UPDATE inscriptions SET statut = "rejetee", traitee_par = ?, traitee_le = NOW() WHERE id = ?',
            [req.user.id, inscriptionId]
        );
        
        res.json({ message: 'Inscription rejetée' });
        
    } catch (error) {
        console.error('Reject inscription error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== INVITATIONS ====================
app.get('/api/invitations/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const [invitations] = await pool.query(
            'SELECT email, nom, prenom, role, branche, unite, region, telephone FROM invitations WHERE token = ? AND statut = "en_attente" AND expires_at > NOW()',
            [token]
        );
        
        if (invitations.length === 0) {
            return res.status(404).json({ message: 'Lien invalide ou expiré' });
        }
        
        res.json(invitations[0]);
        
    } catch (error) {
        console.error('Check invitation error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/invitations/:token/creer-compte', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const [invitations] = await pool.query(
            'SELECT * FROM invitations WHERE token = ? AND statut = "en_attente" AND expires_at > NOW()',
            [token]
        );
        
        if (invitations.length === 0) {
            return res.status(404).json({ message: 'Lien invalide ou expiré' });
        }
        
        const invitation = invitations[0];
        
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [invitation.email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        const passwordHash = await bcrypt.hash(password, 10);
        const uuid = uuidv4();
        
        await pool.query(
            `INSERT INTO users (uuid, email, password_hash, nom, prenom, telephone, branche, unite, region, role, statut, email_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'actif', TRUE)`,
            [uuid, invitation.email, passwordHash, invitation.nom, invitation.prenom, invitation.telephone, invitation.branche, invitation.unite, invitation.region, invitation.role]
        );
        
        await pool.query('UPDATE invitations SET statut = "utilise" WHERE token = ?', [token]);
        
        res.json({ message: 'Compte créé avec succès' });
        
    } catch (error) {
        console.error('Create account error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== ARTICLES ====================
// ==================== ARTICLES AVEC MULTIPLES IMAGES ====================

// Récupérer tous les articles publiés
app.get('/api/articles', async (req, res) => {
    try {
        const [articles] = await pool.query(
            `SELECT a.id, a.slug, a.titre, a.extrait, a.categorie, a.vedette, a.published_at, a.vues,
                    u.nom, u.prenom
             FROM articles a
             JOIN users u ON a.auteur_id = u.id
             WHERE a.publie = true
             ORDER BY a.published_at DESC`
        );
        
        // Ajouter la première image pour chaque article
        for (let article of articles) {
            const [images] = await pool.query(
                'SELECT image_url FROM article_images WHERE article_id = ? ORDER BY ordre LIMIT 1',
                [article.id]
            );
            article.image = images.length > 0 ? images[0].image_url : null;
        }
        
        res.json(articles);
    } catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer un article spécifique
app.get('/api/articles/:slug', async (req, res) => {
    try {
        const [articles] = await pool.query(
            `SELECT a.*, u.nom, u.prenom
             FROM articles a
             JOIN users u ON a.auteur_id = u.id
             WHERE a.slug = ? AND a.publie = true`,
            [req.params.slug]
        );
        
        if (articles.length === 0) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Récupérer toutes les images
        const [images] = await pool.query(
            'SELECT id, image_url, ordre FROM article_images WHERE article_id = ? ORDER BY ordre',
            [articles[0].id]
        );
        
        await pool.query('UPDATE articles SET vues = vues + 1 WHERE id = ?', [articles[0].id]);
        res.json({ ...articles[0], images });
    } catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer TOUS les articles pour l'admin (y compris non publiés)
app.get('/api/admin/articles', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const [articles] = await pool.query(
            `SELECT a.id, a.slug, a.titre, a.extrait, a.categorie, a.vedette, a.publie, a.published_at, a.vues, a.created_at,
                    u.nom, u.prenom
             FROM articles a
             JOIN users u ON a.auteur_id = u.id
             ORDER BY a.created_at DESC`
        );
        res.json(articles);
    } catch (error) {
        console.error('Get admin articles error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer un article pour modification (admin)
app.get('/api/admin/articles/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const [articles] = await pool.query(
            'SELECT * FROM articles WHERE id = ?',
            [req.params.id]
        );
        
        if (articles.length === 0) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        const [images] = await pool.query(
            'SELECT id, image_url, ordre FROM article_images WHERE article_id = ? ORDER BY ordre',
            [req.params.id]
        );
        
        res.json({ ...articles[0], images });
    } catch (error) {
        console.error('Get admin article error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer un article
app.post('/api/admin/articles', authenticateToken, requireRole('superadmin', 'admin'), upload.array('images', 5), async (req, res) => {
    try {
        const { titre, contenu, extrait, categorie, vedette, publie, auteur_id } = req.body;
        
        // Générer le slug
        const slug = titre.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now();
        
        // Insérer l'article
        const [result] = await pool.query(
            `INSERT INTO articles (slug, titre, contenu, extrait, categorie, auteur_id, vedette, publie, published_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [slug, titre, contenu, extrait || null, categorie, auteur_id || req.user.id, vedette === '1' || vedette === 1 || vedette === true, publie === '1' || publie === 1 || publie === true, (publie === '1' || publie === 1 || publie === true) ? new Date() : null]
        );
        
        const articleId = result.insertId;
        
        // Ajouter les images
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const imageUrl = `/uploads/articles/${req.files[i].filename}`;
                await pool.query(
                    'INSERT INTO article_images (article_id, image_url, ordre) VALUES (?, ?, ?)',
                    [articleId, imageUrl, i]
                );
            }
        }
        
        res.status(201).json({ message: 'Article créé', id: articleId, slug });
        
    } catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
});

// Modifier un article
app.put('/api/admin/articles/:id', authenticateToken, requireRole('superadmin', 'admin'), upload.array('images', 5), async (req, res) => {
    try {
        const articleId = req.params.id;
        const { titre, contenu, extrait, categorie, vedette, publie } = req.body;
        
        // Vérifier si l'article existe
        const [existingArticle] = await pool.query('SELECT id FROM articles WHERE id = ?', [articleId]);
        if (existingArticle.length === 0) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        // Mettre à jour l'article
        const updates = [];
        const values = [];
        
        if (titre !== undefined && titre !== '') {
            const slug = titre.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') + '-' + Date.now();
            updates.push('titre = ?, slug = ?');
            values.push(titre, slug);
        }
        if (contenu !== undefined && contenu !== '') { updates.push('contenu = ?'); values.push(contenu); }
        if (extrait !== undefined) { updates.push('extrait = ?'); values.push(extrait); }
        if (categorie !== undefined && categorie !== '') { updates.push('categorie = ?'); values.push(categorie); }
        if (vedette !== undefined) { updates.push('vedette = ?'); values.push(vedette === '1' || vedette === 1 || vedette === true); }
        if (publie !== undefined) {
            updates.push('publie = ?, published_at = ?');
            const isPublished = (publie === '1' || publie === 1 || publie === true);
            values.push(isPublished, isPublished ? new Date() : null);
        }
        
        if (updates.length > 0) {
            values.push(articleId);
            await pool.query(`UPDATE articles SET ${updates.join(', ')} WHERE id = ?`, values);
        }
        
        // Ajouter les nouvelles images (seulement si l'article existe)
        if (req.files && req.files.length > 0) {
            // Récupérer l'ordre actuel
            const [currentImages] = await pool.query(
                'SELECT COUNT(*) as count FROM article_images WHERE article_id = ?',
                [articleId]
            );
            let ordre = currentImages[0].count;
            
            for (let i = 0; i < req.files.length; i++) {
                const imageUrl = `/uploads/articles/${req.files[i].filename}`;
                await pool.query(
                    'INSERT INTO article_images (article_id, image_url, ordre) VALUES (?, ?, ?)',
                    [articleId, imageUrl, ordre + i]
                );
            }
        }
        
        res.json({ message: 'Article mis à jour' });
        
    } catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ message: 'Erreur serveur: ' + error.message });
    }
});

// Supprimer une image d'un article
app.delete('/api/admin/articles/:articleId/images/:imageId', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const { articleId, imageId } = req.params;
        
        const [images] = await pool.query(
            'SELECT image_url FROM article_images WHERE id = ? AND article_id = ?',
            [imageId, articleId]
        );
        
        if (images.length > 0) {
            const filePath = path.join(__dirname, images[0].image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await pool.query('DELETE FROM article_images WHERE id = ? AND article_id = ?', [imageId, articleId]);
        
        // Réordonner les images restantes
        await pool.query(
            'SET @ordre = -1; UPDATE article_images SET ordre = @ordre := @ordre + 1 WHERE article_id = ? ORDER BY ordre;',
            [articleId]
        );
        
        res.json({ message: 'Image supprimée' });
    } catch (error) {
        console.error('Delete article image error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un article
app.delete('/api/admin/articles/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const articleId = req.params.id;
        
        // Récupérer les images pour supprimer les fichiers
        const [images] = await pool.query(
            'SELECT image_url FROM article_images WHERE article_id = ?',
            [articleId]
        );
        
        for (const image of images) {
            const filePath = path.join(__dirname, image.image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await pool.query('DELETE FROM articles WHERE id = ?', [articleId]);
        
        res.json({ message: 'Article supprimé' });
    } catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== RESSOURCES ====================
app.get('/api/ressources', authenticateToken, async (req, res) => {
    try {
        const [ressources] = await pool.query(
            `SELECT id, titre, description, type, categorie, branche_concernee, fichier, downloads, created_at
             FROM ressources 
             WHERE niveau_acces = 'membre' OR niveau_acces = 'public'
             ORDER BY created_at DESC`
        );
        res.json(ressources);
    } catch (error) {
        console.error('Get ressources error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/admin/ressources', authenticateToken, requireRole('superadmin', 'admin'), upload.single('fichier'), async (req, res) => {
    try {
        const { titre, description, type, categorie, branche_concernee, niveau_acces } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Fichier requis' });
        }
        
        const fichier = `/uploads/ressources/${req.file.filename}`;
        
        const [result] = await pool.query(
            `INSERT INTO ressources (titre, description, fichier, type, categorie, branche_concernee, niveau_acces, auteur_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [titre, description, fichier, type, categorie, branche_concernee || 'toutes', niveau_acces || 'membre', req.user.id]
        );
        
        res.status(201).json({ message: 'Ressource ajoutée', id: result.insertId });
        
    } catch (error) {
        console.error('Create ressource error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/ressources/:id/download', authenticateToken, async (req, res) => {
    try {
        await pool.query('UPDATE ressources SET downloads = downloads + 1 WHERE id = ?', [req.params.id]);
        res.json({ message: 'OK' });
    } catch (error) {
        console.error('Download count error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== ÉVÉNEMENTS ====================
// Remplacer la route existante par celle-ci
app.get('/api/evenements', async (req, res) => {
    try {
        const [evenements] = await pool.query(
            `SELECT * FROM evenements 
             ORDER BY date_debut ASC 
             LIMIT 100`
        );
        res.json(evenements);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
app.post('/api/admin/evenements', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const { titre, description, date_debut, date_fin, lieu, type, branche_concernee } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO evenements (titre, description, date_debut, date_fin, lieu, type, branche_concernee, auteur_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [titre, description, date_debut, date_fin, lieu, type, branche_concernee || 'toutes', req.user.id]
        );
        
        res.status(201).json({ message: 'Événement créé', id: result.insertId });
        
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.delete('/api/admin/evenements/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        await pool.query('DELETE FROM evenements WHERE id = ?', [req.params.id]);
        res.json({ message: 'Événement supprimé' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== ANNONCES ====================
app.get('/api/annonces', authenticateToken, async (req, res) => {
    try {
        const [annonces] = await pool.query(
            `SELECT * FROM annonces 
             WHERE (date_expiration IS NULL OR date_expiration > NOW())
             ORDER BY 
               CASE WHEN type = 'urgence' THEN 1
                    WHEN type = 'important' THEN 2
                    ELSE 3
               END,
               created_at DESC`
        );
        res.json(annonces);
    } catch (error) {
        console.error('Get annonces error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/admin/annonces', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const { titre, contenu, type, date_expiration } = req.body;
        
        const [result] = await pool.query(
            `INSERT INTO annonces (titre, contenu, type, date_expiration, auteur_id)
             VALUES (?, ?, ?, ?, ?)`,
            [titre, contenu, type, date_expiration || null, req.user.id]
        );
        
        res.status(201).json({ message: 'Annonce créée', id: result.insertId });
        
    } catch (error) {
        console.error('Create annonce error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.delete('/api/admin/annonces/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        await pool.query('DELETE FROM annonces WHERE id = ?', [req.params.id]);
        res.json({ message: 'Annonce supprimée' });
    } catch (error) {
        console.error('Delete annonce error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== GALERIE COMPLÈTE (CRUD + MULTIPLES IMAGES) ====================

// Récupérer toutes les galeries avec leurs images
app.get('/api/galerie', async (req, res) => {
    try {
        const [galeries] = await pool.query(
            `SELECT g.id, g.titre, g.description, g.categorie, g.created_at,
                    u.nom, u.prenom
             FROM galerie g
             JOIN users u ON g.auteur_id = u.id
             ORDER BY g.created_at DESC`
        );
        
        for (let galerie of galeries) {
            const [images] = await pool.query(
                'SELECT id, image_url, ordre FROM galerie_images WHERE galerie_id = ? ORDER BY ordre',
                [galerie.id]
            );
            galerie.images = images;
            galerie.image = images.length > 0 ? images[0].image_url : null;
        }
        
        res.json(galeries);
    } catch (error) {
        console.error('Get galerie error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer UNE galerie spécifique (pour modification)
app.get('/api/admin/galerie/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const [galeries] = await pool.query(
            'SELECT * FROM galerie WHERE id = ?',
            [req.params.id]
        );
        
        if (galeries.length === 0) {
            return res.status(404).json({ message: 'Galerie non trouvée' });
        }
        
        const [images] = await pool.query(
            'SELECT id, image_url, ordre FROM galerie_images WHERE galerie_id = ? ORDER BY ordre',
            [req.params.id]
        );
        
        res.json({ ...galeries[0], images });
    } catch (error) {
        console.error('Get one galerie error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// CRÉER une nouvelle galerie (avec multiples images)
app.post('/api/admin/galerie', authenticateToken, requireRole('superadmin', 'admin'), upload.array('images', 10), async (req, res) => {
    try {
        const { titre, description, categorie } = req.body;
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Au moins une image est requise' });
        }
        
        const [result] = await pool.query(
            `INSERT INTO galerie (titre, description, categorie, auteur_id)
             VALUES (?, ?, ?, ?)`,
            [titre, description || null, categorie, req.user.id]
        );
        
        const galerieId = result.insertId;
        
        for (let i = 0; i < req.files.length; i++) {
            const imageUrl = `/uploads/galerie/${req.files[i].filename}`;
            await pool.query(
                'INSERT INTO galerie_images (galerie_id, image_url, ordre) VALUES (?, ?, ?)',
                [galerieId, imageUrl, i]
            );
        }
        
        res.status(201).json({ message: 'Galerie créée', id: galerieId });
        
    } catch (error) {
        console.error('Create galerie error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// MODIFIER une galerie (titre, description, catégorie)
app.put('/api/admin/galerie/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const galerieId = req.params.id;
        const { titre, description, categorie } = req.body;
        
        await pool.query(
            'UPDATE galerie SET titre = ?, description = ?, categorie = ? WHERE id = ?',
            [titre, description || null, categorie, galerieId]
        );
        
        res.json({ message: 'Galerie modifiée' });
        
    } catch (error) {
        console.error('Update galerie error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// AJOUTER une image à une galerie existante
app.post('/api/admin/galerie/:id/images', authenticateToken, requireRole('superadmin', 'admin'), upload.single('image'), async (req, res) => {
    try {
        const galerieId = req.params.id;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Image requise' });
        }
        
        const [existingImages] = await pool.query(
            'SELECT COUNT(*) as count FROM galerie_images WHERE galerie_id = ?',
            [galerieId]
        );
        
        if (existingImages[0].count >= 10) {
            return res.status(400).json({ message: 'Maximum 10 images par galerie' });
        }
        
        const imageUrl = `/uploads/galerie/${req.file.filename}`;
        const nextOrdre = existingImages[0].count;
        
        await pool.query(
            'INSERT INTO galerie_images (galerie_id, image_url, ordre) VALUES (?, ?, ?)',
            [galerieId, imageUrl, nextOrdre]
        );
        
        res.status(201).json({ message: 'Image ajoutée' });
        
    } catch (error) {
        console.error('Add image error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// SUPPRIMER une image spécifique d'une galerie
app.delete('/api/admin/galerie/:galerieId/images/:imageId', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const { galerieId, imageId } = req.params;
        
        const [images] = await pool.query(
            'SELECT image_url FROM galerie_images WHERE id = ? AND galerie_id = ?',
            [imageId, galerieId]
        );
        
        if (images.length > 0) {
            const filePath = path.join(__dirname, images[0].image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await pool.query('DELETE FROM galerie_images WHERE id = ? AND galerie_id = ?', [imageId, galerieId]);
        
        // Réordonner les images restantes
        await pool.query(
            'SET @ordre = -1; UPDATE galerie_images SET ordre = @ordre := @ordre + 1 WHERE galerie_id = ? ORDER BY ordre;',
            [galerieId]
        );
        
        res.json({ message: 'Image supprimée' });
        
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// SUPPRIMER une galerie complète
app.delete('/api/admin/galerie/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const galerieId = req.params.id;
        
        const [images] = await pool.query(
            'SELECT image_url FROM galerie_images WHERE galerie_id = ?',
            [galerieId]
        );
        
        for (const image of images) {
            const filePath = path.join(__dirname, image.image_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await pool.query('DELETE FROM galerie WHERE id = ?', [galerieId]);
        
        res.json({ message: 'Galerie supprimée' });
        
    } catch (error) {
        console.error('Delete galerie error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== UTILISATEURS ====================
app.get('/api/admin/users', authenticateToken, requireRole('superadmin'), async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, uuid, email, nom, prenom, role, telephone, branche, unite, region, statut, last_login, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.put('/api/admin/users/:id/status', authenticateToken, requireRole('superadmin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const { statut } = req.body;
        
        await pool.query('UPDATE users SET statut = ? WHERE id = ?', [statut, userId]);
        res.json({ message: 'Statut mis à jour' });
        
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== PROFIL ====================
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, uuid, email, nom, prenom, role, telephone, branche, unite, region, created_at 
             FROM users 
             WHERE id = ?`,
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json(users[0]);
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { nom, prenom, telephone, branche, unite, region } = req.body;
        
        const updates = [];
        const values = [];
        
        if (nom) { updates.push('nom = ?'); values.push(nom); }
        if (prenom) { updates.push('prenom = ?'); values.push(prenom); }
        if (telephone) { updates.push('telephone = ?'); values.push(telephone); }
        if (branche) { updates.push('branche = ?'); values.push(branche); }
        if (unite) { updates.push('unite = ?'); values.push(unite); }
        if (region) { updates.push('region = ?'); values.push(region); }
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
        }
        
        values.push(req.user.id);
        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
        
        res.json({ message: 'Profil mis à jour' });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== RESSOURCES ADMIN ====================
// Récupérer toutes les ressources pour l'admin
app.get('/api/admin/ressources', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const [ressources] = await pool.query(
            'SELECT * FROM ressources ORDER BY created_at DESC'
        );
        res.json(ressources);
    } catch (error) {
        console.error('Get admin ressources error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer une ressource
app.delete('/api/admin/ressources/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const ressourceId = req.params.id;
        
        // Récupérer le fichier pour le supprimer
        const [ressources] = await pool.query('SELECT fichier FROM ressources WHERE id = ?', [ressourceId]);
        
        if (ressources.length > 0 && ressources[0].fichier) {
            const filePath = path.join(__dirname, ressources[0].fichier);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        await pool.query('DELETE FROM ressources WHERE id = ?', [ressourceId]);
        res.json({ message: 'Ressource supprimée' });
        
    } catch (error) {
        console.error('Delete ressource error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== ÉVÉNEMENTS ADMIN ====================
// Récupérer tous les événements pour l'admin
app.get('/api/admin/evenements', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const [evenements] = await pool.query(
            'SELECT * FROM evenements ORDER BY date_debut DESC'
        );
        res.json(evenements);
    } catch (error) {
        console.error('Get admin events error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Modifier un événement
app.put('/api/admin/evenements/:id', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        const eventId = req.params.id;
        const { titre, description, date_debut, date_fin, lieu, type, branche_concernee } = req.body;
        
        await pool.query(
            `UPDATE evenements 
             SET titre = ?, description = ?, date_debut = ?, date_fin = ?, lieu = ?, type = ?, branche_concernee = ?
             WHERE id = ?`,
            [titre, description || null, date_debut, date_fin || null, lieu || null, type, branche_concernee || 'toutes', eventId]
        );
        
        res.json({ message: 'Événement modifié' });
        
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== STATS DASHBOARD ====================
app.get('/api/admin/stats', authenticateToken, requireRole('superadmin', 'admin'), async (req, res) => {
    try {
        // Nombre d'articles
        const [articlesCount] = await pool.query('SELECT COUNT(*) as count FROM articles');
        
        // Nombre d'articles publiés
        const [publishedArticles] = await pool.query('SELECT COUNT(*) as count FROM articles WHERE publie = 1');
        
        // Nombre de galeries
        const [galeriesCount] = await pool.query('SELECT COUNT(*) as count FROM galerie');
        
        // Nombre d'événements à venir
        const [upcomingEvents] = await pool.query('SELECT COUNT(*) as count FROM evenements WHERE date_debut >= NOW()');
        
        // Nombre d'inscriptions en attente
        const [pendingInscriptions] = await pool.query('SELECT COUNT(*) as count FROM inscriptions WHERE statut = "en_attente"');
        
        // Nombre d'utilisateurs actifs
        const [activeUsers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE statut = "actif"');
        
        // Nombre total de vues d'articles
        const [totalViews] = await pool.query('SELECT SUM(vues) as total FROM articles');
        
        res.json({
            articles: articlesCount[0].count,
            articlesPublies: publishedArticles[0].count,
            galeries: galeriesCount[0].count,
            evenementsAvenir: upcomingEvents[0].count,
            inscriptionsEnAttente: pendingInscriptions[0].count,
            utilisateursActifs: activeUsers[0].count,
            vuesTotal: totalViews[0].total || 0
        });
        
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ==================== TEST ====================
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API EEDC fonctionne',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// ==================== DÉMARRAGE ====================
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`   EEDC API - Démarrée avec succès`);
    console.log(`========================================`);
    console.log(`   Port: ${PORT}`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Test: http://localhost:${PORT}/api/test`);
    console.log(`========================================\n`);
});