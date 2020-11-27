require('dotenv').config();

const express = require('express');

// Init app

const app = express();

app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/api/cronjob', (req, res, next) => {
    console.log('${new Date()}: Cronjob called. ');
    console.log(req.headers);
    res.send('okay');
});

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
