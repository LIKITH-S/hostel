require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });

    console.log("🚀 Connected to MySQL successfully!");

    // Drop foreign key checks for clean setup
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Drop existing tables (optional cleanup)
    await connection.query(`
    DROP TABLE IF EXISTS movement_logs;
    DROP TABLE IF EXISTS gate_passes;
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS wardens;
    DROP TABLE IF EXISTS users;
  `);

    // Re-enable FK checks
    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

    // USERS TABLE
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student','warden','admin') NOT NULL,
      phone VARCHAR(30),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // STUDENTS TABLE
    await connection.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT PRIMARY KEY,
      roll_no VARCHAR(50) UNIQUE NOT NULL,
      room VARCHAR(50) NOT NULL,
      parent_name VARCHAR(255),
      parent_email VARCHAR(255),
      parent_phone VARCHAR(50),
      FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

    // WARDENS TABLE
    await connection.query(`
    CREATE TABLE IF NOT EXISTS wardens (
      id INT PRIMARY KEY,
      FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

    // GATE PASSES TABLE
    await connection.query(`
    CREATE TABLE IF NOT EXISTS gate_passes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      purpose TEXT,
      destination VARCHAR(255),
      start_time DATETIME,
      end_time DATETIME,
      parent_confirmed TINYINT DEFAULT 0,
      warden_status ENUM('pending','approved','rejected') DEFAULT 'pending',
      warden_id INT,
      qr_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (warden_id) REFERENCES users(id)
    );
  `);

    // MOVEMENT LOGS TABLE
    await connection.query(`
    CREATE TABLE IF NOT EXISTS movement_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pass_id INT NOT NULL,
      event ENUM('checkin','checkout') NOT NULL,
      gate_id VARCHAR(100),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pass_id) REFERENCES gate_passes(id) ON DELETE CASCADE
    );
  `);

    console.log("✅ All tables created successfully!");
    await connection.end();
}

setupDatabase().catch(err => {
    console.error("❌ Error setting up database:", err.message);
});
