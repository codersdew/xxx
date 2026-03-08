const express = require('express');
const cors = require('cors'); // Import cors package
const bodyParser = require("body-parser");
const path = require('path');
const rateLimit = require('express-rate-limit');
const code = require('./pair'); 

const app = express();
const PORT = process.env.PORT || 8000;
const __path = process.cwd();

require('events').EventEmitter.defaultMaxListeners = 500;

// Trust the proxy to get the correct client IP for rate limiting (Heroku, etc.)
app.set('trust proxy', 1);

// Enable CORS for all domains
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a rate limiter to prevent spamming the pair code endpoint
const pairCodeLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 20, // Limit each IP to 20 requests per window
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: 'Too many requests for a pair code from this IP. Please try again after 5 minutes.'
    },
});

//app.use('/', pairCodeLimiter, code);
app.use('/code', pairCodeLimiter, code);

app.get("/", (req, res) =>
  res.sendFile(__path + "/frontend/index.html"),
);

app.get("/pair", (req, res) =>
  res.sendFile(__path + "/frontend/pair.html"),
);

app.get("/login", (req, res) =>
  res.sendFile(__path + "/frontend/login.html"),
);

app.get("/settings", (req, res) =>
  res.sendFile(__path + "/frontend/settings.html"),
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;