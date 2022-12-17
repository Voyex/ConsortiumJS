const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const conn = require('../configs/connectdb');

router.use('/', async (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!(email && password)) {
    return res.status(400).send({error: 'Missing email or password'});
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const sqlStatment = 'INSERT INTO user (email, password) VALUES (?,?)';
  conn.execute(sqlStatment, [email, hashedPass]).then(() => {
    return res.status(200).send({message: 'User created successfully'});
  }).catch(() => {
    return res.status(500).send({error: 'Failed to create user'});
  });
});

module.exports = router;