import express from 'express';
import bodyParser from 'body-parser';
import router from './api-router';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import errorHander from './middlewares/error-handler';
// Enable the use of environment variables
dotenv.config();

// Constants
const app: express.Application = express();
const port = process.env.PORT || 3000;

// Error Handling
app.use(errorHander);
// CORS
app.use(cors({}));
// For accepting post data from requests
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Allow cookies to be accessed
app.use(cookieParser());
// Register routes
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

module.exports = app;
