const express = require('express');
const fs = require('fs');
const cors = require('cors');
const request = require('request');

const allowedDomains = JSON.parse(fs.readFileSync('allowed-domains.json'));

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    const imageUrl = req.query.url;

    if (!imageUrl) {
        res.status(400).send('No image URL provided');
        return;
    }

    // if allowed domain referer set cors header
    if (allowedDomains.includes(req.headers.referer)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.referer);
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }

    const imageStream = request(imageUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        },
    });

    // Pipe the image data from the stream to the response
    imageStream.pipe(res);
});

app.listen(3000, () => console.log('Image proxy server listening on port 3000'));
