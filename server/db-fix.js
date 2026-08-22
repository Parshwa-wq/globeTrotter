const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function fixDB() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'globetrotter_db'
        });

        console.log("Dropping trip_routes to clear foreign key lock...");
        await connection.query("DROP TABLE IF EXISTS trip_routes;");

        console.log("Re-running core schema.sql...");
        const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
        for (let query of schemaSql.split(';').filter(q => q.trim())) {
            if (query.trim()) await connection.query(query);
        }

        console.log("Re-running seed.sql to populate dummy data...");
        const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');
        for (let query of seedSql.split(';').filter(q => q.trim())) {
            if (query.trim()) await connection.query(query);
        }

        console.log("Re-applying add_trip_routes.sql...");
        const routesSql = fs.readFileSync(path.join(__dirname, '../database/add_trip_routes.sql'), 'utf8');
        for (let query of routesSql.split(';').filter(q => q.trim())) {
            if (query.trim()) await connection.query(query);
        }

        console.log("✅ Database completely restored and fixed!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Fix failed:", err);
        process.exit(1);
    }
}
fixDB();
