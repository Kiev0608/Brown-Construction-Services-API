
const sql = require("mssql");

const config = {
  user: "YOUR_SQL_USERNAME",
  password: "YOUR_SQL_PASSWORD",
  server: "localhost",
  database: "MajokoDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("✅ Connected to SQL Server");
  } catch (err) {
    console.error("❌ SQL connection error:", err);
  }
}

module.exports = { sql, connectDB };
