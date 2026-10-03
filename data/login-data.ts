import { config } from '../utils/config';

export interface Credentials { username: string; password: string }

const credentials: Record<string, Credentials> = {
  valid: { username: config.username, password: config.password },
  invalid_username: { username: 'unknown-user', password: config.password },
  wrong_password: { username: config.username, password: 'WrongPass1!' },
  blank: { username: '', password: '' },
  username_only: { username: config.username, password: '' },
  password_only: { username: '', password: config.password },
};

export function loginData(name: string): Credentials {
  const entry = credentials[name];
  if (!entry) throw new Error(`Unknown login data set: ${name}`);
  return entry;
}
