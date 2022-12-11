const express = require('express');
const bodyParser = 'body-parser';


const app = express();
// App configuration
app.set('view-engine', 'ejs');
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);

app.get('/', (req, res) => {
	res.sendFile('index.html', { root: '__dirname' });
});

// APIs
app.get('/hello', (req, res) => {
	const text = req.body.text;

	return res.status(200).send({message: `Hello ${text}`});
});

// Start the server
const port = 3000;
app.listen(port, () => {
	console.log(`Consortium now running on port ${port}`);
});

module.exports = app;