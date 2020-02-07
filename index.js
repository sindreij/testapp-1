require('dotenv').config();

const express = require('express');

// Init app

const app = express();

// Routes

app.get('/', (req, res) => {
    res.send(process.env.MY_NOT_SO_SECRET);
});

app.get('/health', (req, res) => {
    res.send('ok');
});

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
