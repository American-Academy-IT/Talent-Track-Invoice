import crypto from 'crypto';

const encryptPassword = (password: string): string => {
  const salt = process.env?.SALT_KEY;
  if (!salt) {
    console.log('Missing Salt Key');
    process.exit(1);
  }
  return crypto.pbkdf2Sync(password, salt, 512, 256, 'sha512').toString('hex');
};

export default encryptPassword;
