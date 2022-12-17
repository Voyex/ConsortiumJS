const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const conn = require('../configs/connectdb');

router.post('/', async (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  // Email and Password are required feilds
  if (!(email && password)) {
    return res.status(400).send({error: 'Missing email or password'});
  }
	
  /* 
	Make the SQL query for the hashed password
	compare the passwords
	respond to the user
	*/
  const sqlStatment = 'SELECT password FROM user WHERE password = ?';
	
  let result;
  try {
    [result] = await conn.query(sqlStatment, [password]);
  } catch (error) {
    return res.status(500).send({error: 'Database query failed'});
  }

  // Return an error of the user could not be found
  if (result?.length <= 0) {
    return res.status(401).send({error: 'Incorrect email or password'});
  }
});

module.exports = router;