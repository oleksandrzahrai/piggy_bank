import { MigrationInterface, QueryRunner } from 'typeorm';

export class Create1770971967046 implements MigrationInterface {
  name = 'Create1770971967046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `SET search_path TO ${process.env.POSTGRES_SCHEMA}`,
    );
    await queryRunner.query(
      `CREATE TABLE "days" ("id" SERIAL NOT NULL, "dayNumber" integer NOT NULL, "isPaid" boolean NOT NULL DEFAULT false, "paidAt" TIMESTAMP, CONSTRAINT "PK_c2c66eb46534bea34ba48cc4d7f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "days"`);
  }
}
