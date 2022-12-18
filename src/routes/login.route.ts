import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { conn } from '../configs/connectdb';
import jwt from 'jsonwebtoken';
import { UserTokens } from '/user-tokens.type';
const router = Router();

export default router.post('/', async (req: Request, res: Response): Promise<void> => {
  const email = req.body?.email;
  const password = req.body?.password;

  // Email and Password are required feilds
  if (!(email && password)) {
    res.status(400).send({error: 'Missing email or password'});
    return;
  }
	
  /* 
	Make the SQL query for the hashed password
	compare the passwords
	respond to the user
	*/
  const sqlStatment = 'SELECT password FROM user WHERE email = ?';
	
  let rows: any;
  try {
    [rows] = await conn.execute(sqlStatment, [email]);
    // Return an error of the user could not be found
    if (rows?.length <= 0) {
      res.status(401).send({error: 'Incorrect email or password'});
      return;
    }
  } catch (error) {
    res.status(500).send({error: 'Database query failed'});
    return;
  }
  const userData = rows[0] ?? {};

  try {
    const isCorrectPass: boolean = await bcrypt.compare(password, userData?.password);
    if (isCorrectPass) {
      const tokens = createJWT(userData); 
      // Set the cookies
      res.cookie('accessToken', tokens.accessToken, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
      });
      res.cookie('refreshToken', tokens.refreshToken, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
      });
      res.status(200).send({message: 'Logged in successfully'});
      return;
    }
    res.status(401).send({error: 'Incorrect email or password'});
    return;
  } catch (error) {
    res.status(500).send({error: 'Password check failed'});
    return;
  }
});

const createJWT = (payloadData: any): UserTokens => {
  const accessSecret = process.env?.ACCESS_TOKEN_SECRET ?? '';
  const refreshSecret = process.env?.REFRESH_TOKEN_SECRET ?? '';

  const userTokens = {} as UserTokens;

  // Generate JWT here
  userTokens.accessToken = jwt.sign({
    email: payloadData.email,
    role: payloadData.role,
    id: payloadData.id,
  }, accessSecret, { expiresIn: '10m' });
  userTokens.refreshToken = jwt.sign({
    email: payloadData.email,
    role: payloadData.role,
    id: payloadData.id,
  }, refreshSecret, { expiresIn: '1d' });

  return userTokens;
};