import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordResetToken1782635570027 implements MigrationInterface {
    name = 'AddPasswordResetToken1782635570027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_tokens" ("id" varchar PRIMARY KEY NOT NULL, "tokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "usedAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_password_reset_tokens" ("id" varchar PRIMARY KEY NOT NULL, "tokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "usedAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_d6a19d4b4f6c62dcd29daa497e2" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_password_reset_tokens"("id", "tokenHash", "expiresAt", "usedAt", "userId", "createdAt") SELECT "id", "tokenHash", "expiresAt", "usedAt", "userId", "createdAt" FROM "password_reset_tokens"`);
        await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
        await queryRunner.query(`ALTER TABLE "temporary_password_reset_tokens" RENAME TO "password_reset_tokens"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_tokens" RENAME TO "temporary_password_reset_tokens"`);
        await queryRunner.query(`CREATE TABLE "password_reset_tokens" ("id" varchar PRIMARY KEY NOT NULL, "tokenHash" varchar NOT NULL, "expiresAt" datetime NOT NULL, "usedAt" datetime, "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "password_reset_tokens"("id", "tokenHash", "expiresAt", "usedAt", "userId", "createdAt") SELECT "id", "tokenHash", "expiresAt", "usedAt", "userId", "createdAt" FROM "temporary_password_reset_tokens"`);
        await queryRunner.query(`DROP TABLE "temporary_password_reset_tokens"`);
        await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    }

}
