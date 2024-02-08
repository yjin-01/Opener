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

  async find(verificationEmail): Promise<EmailVerification | null> {
    try {
      const result = await this.entityManager
        .getRepository(EmailVerification)
        .find({
          where: { email: verificationEmail.email },
          order: { id: 'DESC' },
          take: 1,
        });
      return result[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(verificationEmail): Promise<number | undefined> {
    try {
      const { affected } = await this.entityManager
        .getRepository(EmailVerification)
        .update({ id: verificationEmail.id }, { isVerified: true });
      return affected;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
