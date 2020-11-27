require('dotenv').config();

const express = require('express');

// Init app

const app = express();

app.use(express.json());

// Routes

app.get('/health', (req, res) => {
    res.send('ok');
});

app.get('/', (req, res) => {
    res.send(`${new Date()}: Hello world (${process.env.ITERAPP_BUILD_NUMBER})`);
});

app.get('/api/cronjob', (req, res, next) => {
    console.log(`${new Date()}: Cronjob called. (${process.env.ITERAPP_BUILD_NUMBER})`);
    console.log(req.headers);
    res.send('okay');
});

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
