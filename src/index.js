require('dotenv').config();

const express = require('express');

const db = require('./db');

// Init app

const app = express();

app.use(express.json());

db.initDb().catch(err => {
    console.error(err);
    process.exit(1);
});

// Routes

app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname + '/../public/' }));

app.get('/api/messages', (req, res, next) => {
    db.getMessages()
        .then(messages => res.json(messages))
        .catch(next);
});

app.get('/api/cronjob', (req, res, next) => {
    console.log('Cronjob called');
    console.log(req.headers);
    res.send('okay');
});

app.post('/api/messages', (req, res, next) => {
    db.postMessage(req.body.message)
        .then(() => {
            res.send('OK');
        })
        .catch(next);
});

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
