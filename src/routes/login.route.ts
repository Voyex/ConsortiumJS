import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import conn from '../configs/connectdb';
import jwt from 'jsonwebtoken';
import { UserTokens } from '../models/user/user-tokens.model';
import tryCatch from '../utils/tryCatch';
import { HttpError } from '../models/http-error.model';
import { UserPayload } from '../models/user/user-payload.model';
import { CookieConfig } from '../models/cookie-config.model';
import { SameSite } from '../enums/same-site.enum';
const router = Router();

export default router.post(
  '/',
  tryCatch(async (req: Request, res: Response): Promise<any> => {
    const email = req.body?.email;
    const password = req.body?.password;

    // Email and Password are required feilds
    if (!(email && password)) {
      throw new HttpError('Incorrect Username or Password', 401);
    }

    const userData: UserPayload = await getUserFromEmail(email);
    const isCorrectPass: boolean = await bcrypt.compare(password, userData.password);

    if (isCorrectPass) {
      const tokens: UserTokens = await createJWT(userData);

      const cookieConfig: CookieConfig = {
        secure: true,
        sameSite: SameSite.None,
        httpOnly: true,
      };

      // Set the cookies
      res.cookie('accessToken', tokens.accessToken, cookieConfig);
      res.cookie('refreshToken', tokens.refreshToken, cookieConfig);
      return res.status(200).send({ message: 'Logged in successfully' });
    } else {
      throw new HttpError('Incorrect Password', 401);
    }
  })
);

/**
 * Creates JWTs containing user information
 * @param data user data used to populate the JWT
 * @returns {UserTokens}
 */
async function createJWT(data: UserPayload): Promise<UserTokens> {
  if (!(process.env?.ACCESS_TOKEN_SECRET && process.env?.REFRESH_TOKEN_SECRET)) {
    throw new HttpError('JWT Token Scerets Not Defined', 500);
  }

  const accessSecret = process.env?.ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env?.REFRESH_TOKEN_SECRET;

  const userTokens = {} as UserTokens;

  // Generate JWT here
  userTokens.accessToken = jwt.sign(
    {
      email: data.email,
      id: data.id,
    },
    accessSecret,
    { expiresIn: '10m' }
  );
  userTokens.refreshToken = jwt.sign(
    {
      email: data.email,
      id: data.id,
    },
    refreshSecret,
    { expiresIn: '1d' }
  );

  return userTokens;
}

/**
 * Gets the user from the database associated with the provided email
 * @param email The email address associated with the user
 * @returns {UserPayload} Information about the user
 */
async function getUserFromEmail(email: string): Promise<UserPayload> {
  const sqlStatment = 'SELECT * FROM user WHERE email = ?';

  const [rows] = await conn.execute<UserPayload[]>(sqlStatment, [email]);
  // Return an error of the user could not be found
  if (rows?.length <= 0) {
    throw new HttpError('Could not find user', 400);
  }

  return rows[0];
}
