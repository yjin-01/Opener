import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EmailVerification } from './entity/email.verifications.entity';

@Injectable()
export class EmailRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async log(emailVerification): Promise<number | null> {
    try {
      const { identifiers } = await this.entityManager
        .getRepository(EmailVerification)
        .createQueryBuilder()
        .insert()
        .into(EmailVerification)
        .values([emailVerification])
        .execute();
      return identifiers[0].id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
