import 'dotenv/config';
import { InternalServerErrorException } from '@nestjs/common';
import * as process from 'process';

import { isValidString } from '../strings';


/* --------
 * Internal Types
 * -------- */
type EnvToken =
  | 'DB_URL'
  | 'DB_PORT'
  | 'DB_USER'
  | 'DB_PASSWORD'
  | 'DB_AUTH_SOURCE'
  | 'ACCESS_TOKEN_SECRET'
  | 'ACCESS_TOKEN_VALIDITY'
  | 'REFRESH_TOKEN_SECRET'
  | 'REFRESH_TOKEN_VALIDITY'
  | 'SMTP_HOST'
  | 'SMTP_PORT'
  | 'SMTP_USER'
  | 'SMTP_PASSWORD'
  | 'AWS_ACCESS_KEY'
  | 'AWS_SECRET_KEY'
  | 'AWS_BUCKET_NAME';


export function getRequiredEnv(token: EnvToken): string {
  /** Extract the variable from the current environment */
  const value = process.env[token];

  /** Assert is a valid string */
  if (!isValidString(value)) {
    throw new InternalServerErrorException(`Missing environment value for token ${token}`);
  }

  return value;
}


export function getOptionalEnv(token: EnvToken, fallback: string): string {
  return process.env[token] || fallback;
}
