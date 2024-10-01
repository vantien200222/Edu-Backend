const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo bảng "products" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(255),
                stock INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "products" created or already exists.');

    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();
