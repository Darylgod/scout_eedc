// seed-data-pro.mjs
import mysql from 'mysql2/promise';

async function seedData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'eedc_db'
    });

    try {
        // Récupérer les IDs
        const [adminRows] = await connection.execute(
            "SELECT id FROM users WHERE email = 'admin@eedc.cm'"
        );
        const [chefRows] = await connection.execute(
            "SELECT id FROM users WHERE email = 'chef@eedc.cm'"
        );
        
        const adminId = adminRows[0]?.id;
        const chefId = chefRows[0]?.id;
        
        if (!adminId || !chefId) {
            console.log('❌ Utilisateurs non trouvés. Exécutez d\'abord create-users-hash.mjs');
            return;
        }
        
        console.log('👥 IDs trouvés - Admin:', adminId, 'Chef:', chefId);

        // 1. Ajouter des articles
        console.log('\n📝 Ajout des articles...');
        await connection.execute(`
            INSERT INTO articles (slug, titre, contenu, extrait, categorie, auteur_id, publie, published_at, vedette, created_by, updated_by)
            VALUES 
            ('camp-regional-2026', 'Camp régional 2026', 
             'Le camp régional 2026 aura lieu du 15 au 25 juillet à Mbalmayo. Au programme : activités de pleine nature, formation au leadership, projets communautaires et moments de fraternité.', 
             'Préparez-vous pour le plus grand camp scout de l\'année !', 'camp', ?, 1, NOW(), 1, ?, ?),
            ('investiture-scouts', "Cérémonie d'investiture de 45 scouts", 
             'Vendredi dernier, 45 jeunes ont fait leur promesse scoute lors d\'une cérémonie solennelle en présence des familles.', 
             'Une nouvelle génération de scouts s\'engage', 'ceremonie', ?, 1, NOW(), 0, ?, ?),
            ('projet-environnement', 'Projet environnement - 300 arbres plantés', 
             'Dans le cadre de notre engagement pour l\'ODD 13, nous avons planté 300 arbres dans la région de Yaoundé.', 
             'L\'EEDC s\'engage pour l\'environnement', 'odd', ?, 1, NOW(), 0, ?, ?)
        `, [adminId, adminId, adminId, adminId, adminId, adminId, adminId]);
        console.log('   ✅ 3 articles ajoutés');

        // 2. Ajouter des événements
        console.log('\n📅 Ajout des événements...');
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        await connection.execute(`
            INSERT INTO evenements (titre, description, date_debut, date_fin, lieu, type, auteur_id, statut, created_by)
            VALUES 
            ('Camp d\'été des Éclaireurs', 'Camp de 5 jours pour les 11-15 ans', ?, ?, 'Mbalmayo', 'camp', ?, 'publie', ?),
            ('Réunion des chefs d\'unité', 'Réunion mensuelle de coordination', ?, NULL, 'Yaoundé', 'reunion', ?, 'publie', ?),
            ('Formation des animateurs', 'Formation aux techniques d\'animation', ?, ?, 'Douala', 'formation', ?, 'publie', ?)
        `, [
            nextMonth, new Date(nextMonth.getTime() + 5*24*60*60*1000), adminId, adminId,
            nextWeek, adminId, adminId,
            nextMonth, new Date(nextMonth.getTime() + 3*24*60*60*1000), adminId, adminId
        ]);
        console.log('   ✅ 3 événements ajoutés');

        // 3. Ajouter des ressources
        console.log('\n📚 Ajout des ressources...');
        await connection.execute(`
            INSERT INTO ressources (titre, description, fichier, type, categorie, auteur_id, niveau_acces, created_by)
            VALUES 
            ('Guide du chef d\'unité', 'Guide complet pour l\'animation des unités', '/uploads/guide-chef.pdf', 'document', 'pedagogique', ?, 'chef', ?),
            ('Programme annuel 2026', 'Calendrier des activités nationales', '/uploads/programme-2026.pdf', 'document', 'administratif', ?, 'membre', ?),
            ('Fiche technique camp', 'Checklist et organisation camp', '/uploads/fiche-camp.pdf', 'document', 'technique', ?, 'chef', ?)
        `, [adminId, adminId, adminId, adminId, adminId, adminId]);
        console.log('   ✅ 3 ressources ajoutées');

        // 4. Ajouter une inscription de test
        console.log('\n📋 Ajout d\'une inscription test...');
        await connection.execute(`
            INSERT INTO inscriptions (uuid, nom, prenom, email, telephone, date_naissance, branche_souhaitee, region, statut, created_by)
            VALUES (UUID(), 'Mbarga', 'Paul', 'paul.mbarga@email.com', '699887766', '2015-05-15', 'louveteaux', 'Yaoundé', 'soumise', ?)
        `, [adminId]);
        console.log('   ✅ 1 inscription ajoutée');

        // 5. Ajouter une annonce
        console.log('\n📢 Ajout d\'une annonce...');
        const expDate = new Date();
        expDate.setMonth(expDate.getMonth() + 1);
        await connection.execute(`
            INSERT INTO annonces (titre, contenu, type, auteur_id, date_debut, date_expiration, est_active)
            VALUES 
            ('Rentrée scoute 2026', 'Les inscriptions pour la rentrée sont ouvertes ! Rejoignez-nous dès maintenant.', 'info', ?, NOW(), ?, TRUE)
        `, [adminId, expDate]);
        console.log('   ✅ 1 annonce ajoutée');

        // 6. Ajouter des photos à la galerie
        console.log('\n🖼️ Ajout de photos à la galerie...');
        await connection.execute(`
            INSERT INTO galerie (titre, description, image, categorie, date_prise, auteur_id, created_by)
            VALUES 
            ('Camp 2025', 'Photo de groupe du camp', '/uploads/camp-2025.jpg', 'camp', '2025-08-10', ?, ?),
            ('Cérémonie investiture', 'Moment solennel', '/uploads/investiture.jpg', 'ceremonie', '2025-09-15', ?, ?)
        `, [adminId, adminId, adminId, adminId]);
        console.log('   ✅ 2 photos ajoutées');

        console.log('\n✅✅✅ DONNÉES DE TEST AJOUTÉES AVEC SUCCÈS ! ✅✅✅');
        
        // Afficher un récapitulatif
        const [stats] = await connection.execute(`
            SELECT 
                (SELECT COUNT(*) FROM users) as users,
                (SELECT COUNT(*) FROM articles) as articles,
                (SELECT COUNT(*) FROM evenements) as evenements,
                (SELECT COUNT(*) FROM ressources) as ressources,
                (SELECT COUNT(*) FROM inscriptions) as inscriptions
        `);
        console.log('\n📊 STATISTIQUES DE LA BASE :');
        console.log(`   - Utilisateurs: ${stats[0].users}`);
        console.log(`   - Articles: ${stats[0].articles}`);
        console.log(`   - Événements: ${stats[0].evenements}`);
        console.log(`   - Ressources: ${stats[0].ressources}`);
        console.log(`   - Inscriptions: ${stats[0].inscriptions}`);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.error(error);
    } finally {
        await connection.end();
    }
}

seedData();