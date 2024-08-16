import prisma from '../../../lib/prisma';
import { ANALYSIS, END_OF_LIST, START_OF_LIST, THEME } from './constants';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

export const extractDreamContent = (
  content: string,
  elementType: 'list' | 'analysis' | 'theme'
) => {
  const list = content.substring(
    content.indexOf(START_OF_LIST) + START_OF_LIST.length,
    content.indexOf(END_OF_LIST)
  );
  const theme = content.substring(
    content.indexOf(THEME) + THEME.length,
    content.indexOf(ANALYSIS)
  );
  const newAnalysis = content.substring(
    content.indexOf(ANALYSIS) + ANALYSIS.length
  );

  const listArr = list
    .split(/\r?\n/)
    .filter((element) => element !== '' && element !== ' ');

  let result;
  if (elementType === 'list') {
    result = listArr;
  } else if (elementType === 'analysis') {
    result = newAnalysis;
  } else {
    result = theme;
  }
  return result;
};

export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function storeEncryptionKey(
  userId: string,
  encryptionKey: string
) {
  await prisma.user.update({
    where: { id: userId },
    data: { encryptionKey: encryptionKey },
  });
}

export async function getEncryptionKey(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { encryptionKey: true },
  });
  return user?.encryptionKey || null;
}

export function encryptWithUserKey(plainText: string, key: string): string {
  const hashedKey = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
  const encrypted = CryptoJS.AES.encrypt(plainText, hashedKey).toString();

  return encrypted;
}

export function decryptWithUserKey(encryptedText: string, key: string): string {
  const hashedKey = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
  const bytes = CryptoJS.AES.decrypt(encryptedText, hashedKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return decrypted;
}
