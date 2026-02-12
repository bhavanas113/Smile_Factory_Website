require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
// Render uses a dynamic port, so we use process.env.PORT
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// Status variable
let isWhatsAppReady = false;

// ==========================================
// WHATSAPP SETUP
// ==========================================
const client = new Client({
    authStrategy: new LocalAuth(), 
    puppeteer: {
        handleSIGINT: false,
        // Arguments for stable performance on Linux/Docker/Render
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--single-process'
        ],
        // FIXED: Pointing to the standard Linux Chrome path in the Puppeteer Docker image
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome'
    }
});

client.on('qr', (qr) => {
    console.log('⚠️ ACTION REQUIRED: Scan this QR code to start receiving notifications!');
    // This will print the QR code in the Render "Logs" tab
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    isWhatsAppReady = true;
    console.log('✅ SUCCESS: WhatsApp Automation is active!');
});

client.on('authenticated', () => console.log('✅ WhatsApp Authenticated!'));
client.on('auth_failure', () => console.error('❌ WhatsApp Auth Failed. Try deleting .wwebjs_auth folder.'));

client.initialize();

// ==========================================
// DATABASE (Updated for Aiven Cloud)
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 22333,
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'defaultdb',
    ssl: {
        rejectUnauthorized: false // MANDATORY FOR AIVEN
    }
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err.message);
    } else {
        console.log('✅ Database Connected to Aiven: ' + (process.env.DB_NAME || 'defaultdb'));
        
        // --- AUTO-CREATE TABLE LOGIC ---
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            service VARCHAR(255),
            appointment_date VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        db.query(createTableQuery, (err) => {
            if (err) console.error("❌ Error creating table:", err.message);
            else console.log("✅ Table 'appointments' is ready in Aiven!");
        });
        // -------------------------------
    }
});

// ==========================================
// API: BOOKING + NOTIFICATION
// ==========================================
app.post('/api/book', (req, res) => {
    const { name, phone, service, date } = req.body;

    const sql = 'INSERT INTO appointments (name, phone, service, appointment_date) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, phone, service, date], async (err, result) => {
        if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ error: 'Database failed' });
        }

        console.log(`📝 Appointment saved for ${name}. Attempting WhatsApp...`);

        if (isWhatsAppReady) {
            const drNumber = "918080301527"; 
            const chatId = drNumber + "@c.us";
            const message = `*DR. SIDDHI - NEW APPOINTMENT*\n\n` +
                            `👤 Patient: ${name}\n` +
                            `📞 Contact: ${phone}\n` +
                            `🦷 Service: ${service}\n` +
                            `📅 Date: ${date}\n\n` +
                            `_Sent from your website system._`;

            try {
                await client.sendMessage(chatId, message);
                console.log('🚀 WhatsApp message sent to Doctor!');
                res.status(200).json({ message: 'Success! Sent to DB and WhatsApp.' });
            } catch (wpErr) {
                console.error('WhatsApp Send Error:', wpErr);
                res.status(200).json({ message: 'Saved to DB, but WhatsApp failed.' });
            }
        } else {
            console.log('⚠️ WhatsApp not ready yet. Please scan the QR code in the terminal.');
            res.status(200).json({ message: 'Saved to DB. Waiting for WhatsApp login.' });
        }
    });
});

app.get('/api/appointments', (req, res) => {
    db.query('SELECT * FROM appointments ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});

// Root route for Render to check if server is alive
app.get('/', (req, res) => {
    res.send('Smile Factory Server is Running!');
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));