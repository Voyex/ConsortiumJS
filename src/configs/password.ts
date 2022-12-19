import passwordValidator from 'password-validator';
import fs from 'fs';
import PasswordValidator from 'password-validator';

const schema = generateSchema();

async function generateSchema(): Promise<PasswordValidator> {
  // Create a schema
  const schema = new passwordValidator();
  let passwordList: Array<string> = [];
  try {
    passwordList = await parsePasswordList().then();
  } catch (error) {
    console.error(error);
    throw new Error('Error Parsing Password');
  }

  // Add properties to it
  schema.is().min(8); // Minimum length 8
  schema.is().max(100); // Maximum length 100
  schema.is().not().oneOf(passwordList); // Blacklist these values

  return schema;
}

async function parsePasswordList(): Promise<string[]> {
  const filePath = '/home/voyex/Programs/consortium-js-backend/src/blacklist.txt';
  return (await fs.promises.readFile(filePath, 'utf-8')).split(/\r?\n/);
}

export default schema;
