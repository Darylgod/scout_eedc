// test-db-connection.mjs
import mysql from 'mysql2/promise';

async function testConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'eedc_db'
    });

    try {
        console.log('🔍 TEST DE CONNEXION À LA BASE DE DONNÉES\n');
        
        // 1. Tester la connexion
        await connection.ping();
        console.log('✅ Connexion MySQL établie');
        
        // 2. Afficher les tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`\n📋 Tables trouvées (${tables.length}) :`);
        tables.forEach(t => {
            const tableName = Object.values(t)[0];
            console.log(`   - ${tableName}`);
        });
        
        // 3. Vérifier les utilisateurs
        const [users] = await connection.execute(
            'SELECT id, email, nom, prenom, role, statut FROM users WHERE is_deleted = FALSE'
        );
        console.log(`\n👥 Utilisateurs (${users.length}) :`);
        users.forEach(u => {
            console.log(`   - ${u.email} | ${u.nom} ${u.prenom} | ${u.role} | ${u.statut}`);
        });
        
        // 4. Vérifier les articles
        const [articles] = await connection.execute(
            'SELECT COUNT(*) as count FROM articles WHERE is_deleted = FALSE'
        );
        console.log(`\n📝 Articles: ${articles[0].count}`);
        
        // 5. Vérifier les événements
        const [events] = await connection.execute(
            'SELECT COUNT(*) as count FROM evenements WHERE is_deleted = FALSE'
        );
        console.log(`📅 Événements: ${events[0].count}`);
        
        // 6. Vérifier les ressources
        const [ressources] = await connection.execute(
            'SELECT COUNT(*) as count FROM ressources WHERE is_deleted = FALSE'
        );
        console.log(`📚 Ressources: ${ressources[0].count}`);
        
        // 7. Vérifier les logs d'audit
        const [logs] = await connection.execute(
            'SELECT COUNT(*) as count FROM audit_logs'
        );
        console.log(`📊 Logs d\'audit: ${logs[0].count}`);
        
        console.log('\n✅ TOUS LES TESTS RÉUSSIS !');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await connection.end();
    }
}

testConnection();