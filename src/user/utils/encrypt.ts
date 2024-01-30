import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';

export async function enctypt(
  configService: ConfigService,
  plainText,
): Promise<string> {
  try {
    const hash = await bcrypt.hash(
      plainText,
      Number(configService.get('COUNT')),
    );
    return hash;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function isMatch(password, hash): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
