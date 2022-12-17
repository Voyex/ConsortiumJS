// Imports
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const routes = require('./api-router');
const cors = require('cors');
// Enables use of environment variables
require('dotenv').config();

// Constants
const app = express();
const port = process.env.PORT || 3000;


// CORS
app.use(cors({}));
// For accepting post data from requests
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);
// Register routes
app.use(routes);

// Start the server
app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});

module.exports = app;