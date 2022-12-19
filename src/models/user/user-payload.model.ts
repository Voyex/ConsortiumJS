import { RowDataPacket } from 'mysql2';
export interface UserPayload extends RowDataPacket {
  id: number;
  name: string;
  role: string;
  email: string;
  password: string;
  bio: string;
}
