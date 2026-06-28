import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShareExpiresAtToTrip1782633964066 implements MigrationInterface {
    name = 'AddShareExpiresAtToTrip1782633964066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_trips" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "coverPhoto" varchar, "isPublic" boolean NOT NULL DEFAULT (0), "shareToken" varchar, "status" varchar NOT NULL DEFAULT ('draft'), "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "shareExpiresAt" datetime, CONSTRAINT "UQ_c42efc7b8ebdf904fbdd1c7e942" UNIQUE ("shareToken"), CONSTRAINT "FK_db768456df45322f8a749534322" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_trips"("id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt") SELECT "id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt" FROM "trips"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`ALTER TABLE "temporary_trips" RENAME TO "trips"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" RENAME TO "temporary_trips"`);
        await queryRunner.query(`CREATE TABLE "trips" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "coverPhoto" varchar, "isPublic" boolean NOT NULL DEFAULT (0), "shareToken" varchar, "status" varchar NOT NULL DEFAULT ('draft'), "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_c42efc7b8ebdf904fbdd1c7e942" UNIQUE ("shareToken"), CONSTRAINT "FK_db768456df45322f8a749534322" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "trips"("id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt") SELECT "id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt" FROM "temporary_trips"`);
        await queryRunner.query(`DROP TABLE "temporary_trips"`);
    }

}
