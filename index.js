const http = require('http');
const fs = require('fs');
const url = require('url');
const cors = require('cors');

const allowedDomains = JSON.parse(fs.readFileSync('allowed-domains.json'));

http.createServer((request, response) => {
  // Get the Referer header of the request
  const referer = request.headers.referer;

  if (referer) {
    // Check if the domain of the Referer header is in the allowed list
    const refererDomain = new URL(referer).hostname;
    if (allowedDomains.includes(refererDomain)) {
      // Enable CORS for the referer domain
      cors({ origin: refererDomain })(request, response, () => {});

      // Parse the URL of the request and get the image URL from the query parameters
      const imageUrl = url.parse(request.url, true).query.url;

      // Read the image file from the URL using a Readable stream
      const imageStream = fs.createReadStream(imageUrl);

      // Pipe the image data from the stream to the response
      imageStream.pipe(response);
    } else {
      // Send an error message if the domain is not allowed
      response.statusCode = 403;
      response.end('Error: The domain is not in the allowed list');
    }
  }
}).listen(3000);
