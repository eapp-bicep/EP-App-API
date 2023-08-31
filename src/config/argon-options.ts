import { MyArgonOptions } from 'src/types';

export const argonOptions = (): MyArgonOptions => ({
  argon: {
    salt: Buffer.from(process.env.HASH_SALT ?? '', 'utf-8'),
    secret: Buffer.from(process.env.HASH_SECRET ?? '', 'utf-8'),
  },
});
