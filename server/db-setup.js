const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setup() {
    try {
        // Connect WITHOUT specifying the database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        console.log("Creating database 'globe_trotter'...");
        await connection.query("CREATE DATABASE IF NOT EXISTS globe_trotter;");
        await connection.query("USE globe_trotter;");

        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const seedPath = path.join(__dirname, '../database/seed.sql');

        if (fs.existsSync(schemaPath)) {
            console.log("Running schema.sql...");
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            const schemaQueries = schemaSql.split(';').filter(q => q.trim());
            for (let query of schemaQueries) {
                if (query.trim()) await connection.query(query);
            }
        }

        if (fs.existsSync(seedPath)) {
            console.log("Running seed.sql...");
            const seedSql = fs.readFileSync(seedPath, 'utf8');
            const seedQueries = seedSql.split(';').filter(q => q.trim());
            for (let query of seedQueries) {
                if (query.trim()) await connection.query(query);
            }
        }

        console.log("✅ Database recreated successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Setup failed:", err);
        process.exit(1);
    }
}
setup();
