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

    console.log('connected to db');
    return client;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initDb() {
    // Postgres DB might not be up at the same time our container is up,
    // so we need to retry this a few times
    console.log('initializing db');
    let retry = 10;
    while (true) {
        console.log('retrying');
        try {
            console.log('trying');
            await doInitDb();
            console.log('success');
            return;
        } catch (err) {
            console.log('das error');
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
    console.log('connecting');
    let conn = await connect();
    console.log('got connection');

    try {
        console.log('running query');
        await conn.query(
            'CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, text VARCHAR NOT NULL)'
        );
        console.log('finished');
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
    console.log('aaa');
    let conn = await connect();
    console.log('bbb');
    try {
        console.log('ccc');
        let res = await conn.query('SELECT text FROM messages');
        console.log('ddd');
        return res.rows;
    } finally {
        console.log('eee');
        conn.end();
        console.log('fff');
    }
}

module.exports = {
    initDb,
    postMessage,
    getMessages,
};
