const { Client } = require('pg');

async function connect() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();

        client.on('error', (err) => {
            console.error('database error', err.stack);
        });
    } catch (err) {
        client.end();
        throw err;
    }

    return client;
}

async function initDb() {
    let conn = await connect();

    try {
        await conn.query(
            'CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, text VARCHAR NOT NULL)'
        );
    } finally {
        conn.end();
    }
}

async function postMessage(text) {
    let conn = await connect();
    try {
        await conn.query('INSERT INTO messages (text) VALUES ($1) ', [text]);
    } finally {
        conn.end();
    }
}

async function getMessages() {
    let conn = await connect();
    try {
        let res = await conn.query('SELECT text FROM messages');
        return res.rows;
    } finally {
        conn.end();
    }
}

module.exports = {
    initDb,
    postMessage,
    getMessages,
};
