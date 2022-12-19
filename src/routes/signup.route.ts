import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import conn from '../configs/connectdb';
import { HttpError } from '../models/http-error.model';
import tryCatch from '../utils/tryCatch';
import { UserData } from '../models/user/user-data.model';
import emailValidator from 'email-validator';
import passwordSchema from '../configs/password';
const router = Router();

export default router.post(
  '/',
  tryCatch(async (req: Request, res: Response): Promise<any> => {
    const email = req.body?.email;
    const password = req.body?.password;

    // Ensure that required data is present
    if (!(email && password)) {
      throw new HttpError('Missing email or password', 400);
    }
    // Ensure emails have correct input
    if (!emailValidator.validate(email)) {
      throw new HttpError('Invalid email passed', 400);
    }
    // Ensure password is secure
    if (!(await passwordSchema).validate(password)) {
      throw new HttpError('Password is not secure', 400);
    }
    // Populate userData fields
    const userData = new UserData();
    userData.email = email;
    userData.password = await hashPassword(password);

    // Create the user
    // eslint-disable-next-line
    if (await createUser(userData)) {
      res.status(200).send({ message: 'User Created Successfully' });
    }
  })
);

/**
 * Hashes a password
 * @param password representing an unhashed password
 * @returns {Promise<string>} A promise that resolves a hashed password
 */
async function hashPassword(password: string): Promise<string> {
  if (!process.env.COST_FACTOR) {
    throw new HttpError('Cost Factor not found', 500);
  }
  return bcrypt.hash(password, 10);
}

async function createUser(userData: UserData): Promise<boolean> {
  const sqlData: Array<any> = [userData.email, userData.password, userData.name, userData.bio];

  const sqlStatment = 'INSERT INTO user (email, password, name, bio) VALUES (?,?,?,?)';
  await conn.execute(sqlStatment, sqlData).catch((error) => {
    console.error(error.message);
    throw new HttpError('Failed to create user', 500);
  });
  return true;
}
