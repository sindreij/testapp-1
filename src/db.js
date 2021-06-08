const { Client } = require('pg');

async function connect() {
    console.log('connecting to db');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();

        client.on('error', err => {
            console.error('database error', err.stack);
        });
    } catch (err) {
        console.error(err);
        client.end();
        throw err;
    }

    return client;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initDb() {
    // Postgres DB might not be up at the same time our container is up,
    // so we need to retry this a few times
    let retry = 10;
    while (true) {
        try {
            await doInitDb();
            return;
        } catch (err) {
            console.error(err.message);
            if (retry === 0) {
                throw err;
            }
        }
        retry -= 1;
        await sleep(3000);
    }
}

async function doInitDb() {
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
