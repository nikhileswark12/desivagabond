import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaInit1782630294523 implements MigrationInterface {
    name = 'SchemaInit1782630294523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trip_stops" ("id" varchar PRIMARY KEY NOT NULL, "cityName" varchar NOT NULL, "cityId" varchar, "region" varchar, "state" varchar, "arrivalDate" date NOT NULL, "departureDate" date NOT NULL, "orderIndex" integer NOT NULL DEFAULT (0), "activities" text, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "budget_items" ("id" varchar PRIMARY KEY NOT NULL, "category" varchar NOT NULL, "label" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "stopId" varchar, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "packing_items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "category" varchar NOT NULL DEFAULT ('general'), "isPacked" boolean NOT NULL DEFAULT (0), "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "trip_notes" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "stopId" varchar, "stopName" varchar, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "trips" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "coverPhoto" varchar, "isPublic" boolean NOT NULL DEFAULT (0), "shareToken" varchar, "status" varchar NOT NULL DEFAULT ('draft'), "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_c42efc7b8ebdf904fbdd1c7e942" UNIQUE ("shareToken"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "name" varchar NOT NULL, "avatar" varchar, "password" varchar, "role" varchar NOT NULL DEFAULT ('user'), "language" varchar, "pending_email" varchar, "email_verification_token" varchar, "savedDestinations" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "state" varchar NOT NULL, "region" varchar NOT NULL, "type" varchar NOT NULL, "costIndex" varchar NOT NULL, "popularity" integer NOT NULL, "description" varchar NOT NULL, "image" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "city" varchar NOT NULL, "category" varchar NOT NULL, "cost" integer NOT NULL, "duration" integer NOT NULL, "description" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_trip_stops" ("id" varchar PRIMARY KEY NOT NULL, "cityName" varchar NOT NULL, "cityId" varchar, "region" varchar, "state" varchar, "arrivalDate" date NOT NULL, "departureDate" date NOT NULL, "orderIndex" integer NOT NULL DEFAULT (0), "activities" text, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_37cc2e3103d3ad66b08b7ba220d" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_trip_stops"("id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt") SELECT "id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt" FROM "trip_stops"`);
        await queryRunner.query(`DROP TABLE "trip_stops"`);
        await queryRunner.query(`ALTER TABLE "temporary_trip_stops" RENAME TO "trip_stops"`);
        await queryRunner.query(`CREATE TABLE "temporary_budget_items" ("id" varchar PRIMARY KEY NOT NULL, "category" varchar NOT NULL, "label" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "stopId" varchar, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_787630ce04a0a5871e5c88876d1" FOREIGN KEY ("stopId") REFERENCES "trip_stops" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_ad5a5b32fd4e93e4a8ad843cbb4" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_budget_items"("id", "category", "label", "amount", "stopId", "tripId", "createdAt") SELECT "id", "category", "label", "amount", "stopId", "tripId", "createdAt" FROM "budget_items"`);
        await queryRunner.query(`DROP TABLE "budget_items"`);
        await queryRunner.query(`ALTER TABLE "temporary_budget_items" RENAME TO "budget_items"`);
        await queryRunner.query(`CREATE TABLE "temporary_packing_items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "category" varchar NOT NULL DEFAULT ('general'), "isPacked" boolean NOT NULL DEFAULT (0), "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_5d451e7674ad0103145c79cb25e" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_packing_items"("id", "name", "category", "isPacked", "tripId", "createdAt") SELECT "id", "name", "category", "isPacked", "tripId", "createdAt" FROM "packing_items"`);
        await queryRunner.query(`DROP TABLE "packing_items"`);
        await queryRunner.query(`ALTER TABLE "temporary_packing_items" RENAME TO "packing_items"`);
        await queryRunner.query(`CREATE TABLE "temporary_trip_notes" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "stopId" varchar, "stopName" varchar, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_480b5cfb81a59b9612df345815d" FOREIGN KEY ("stopId") REFERENCES "trip_stops" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_f38a05034e47b1bbb59a7d8a9fe" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_trip_notes"("id", "content", "stopId", "stopName", "tripId", "createdAt", "updatedAt") SELECT "id", "content", "stopId", "stopName", "tripId", "createdAt", "updatedAt" FROM "trip_notes"`);
        await queryRunner.query(`DROP TABLE "trip_notes"`);
        await queryRunner.query(`ALTER TABLE "temporary_trip_notes" RENAME TO "trip_notes"`);
        await queryRunner.query(`CREATE TABLE "temporary_trips" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "coverPhoto" varchar, "isPublic" boolean NOT NULL DEFAULT (0), "shareToken" varchar, "status" varchar NOT NULL DEFAULT ('draft'), "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_c42efc7b8ebdf904fbdd1c7e942" UNIQUE ("shareToken"), CONSTRAINT "FK_db768456df45322f8a749534322" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_trips"("id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt") SELECT "id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt" FROM "trips"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`ALTER TABLE "temporary_trips" RENAME TO "trips"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trips" RENAME TO "temporary_trips"`);
        await queryRunner.query(`CREATE TABLE "trips" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "coverPhoto" varchar, "isPublic" boolean NOT NULL DEFAULT (0), "shareToken" varchar, "status" varchar NOT NULL DEFAULT ('draft'), "userId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_c42efc7b8ebdf904fbdd1c7e942" UNIQUE ("shareToken"))`);
        await queryRunner.query(`INSERT INTO "trips"("id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt") SELECT "id", "name", "description", "startDate", "endDate", "coverPhoto", "isPublic", "shareToken", "status", "userId", "createdAt", "updatedAt" FROM "temporary_trips"`);
        await queryRunner.query(`DROP TABLE "temporary_trips"`);
        await queryRunner.query(`ALTER TABLE "trip_notes" RENAME TO "temporary_trip_notes"`);
        await queryRunner.query(`CREATE TABLE "trip_notes" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "stopId" varchar, "stopName" varchar, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "trip_notes"("id", "content", "stopId", "stopName", "tripId", "createdAt", "updatedAt") SELECT "id", "content", "stopId", "stopName", "tripId", "createdAt", "updatedAt" FROM "temporary_trip_notes"`);
        await queryRunner.query(`DROP TABLE "temporary_trip_notes"`);
        await queryRunner.query(`ALTER TABLE "packing_items" RENAME TO "temporary_packing_items"`);
        await queryRunner.query(`CREATE TABLE "packing_items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "category" varchar NOT NULL DEFAULT ('general'), "isPacked" boolean NOT NULL DEFAULT (0), "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "packing_items"("id", "name", "category", "isPacked", "tripId", "createdAt") SELECT "id", "name", "category", "isPacked", "tripId", "createdAt" FROM "temporary_packing_items"`);
        await queryRunner.query(`DROP TABLE "temporary_packing_items"`);
        await queryRunner.query(`ALTER TABLE "budget_items" RENAME TO "temporary_budget_items"`);
        await queryRunner.query(`CREATE TABLE "budget_items" ("id" varchar PRIMARY KEY NOT NULL, "category" varchar NOT NULL, "label" varchar NOT NULL, "amount" decimal(10,2) NOT NULL, "stopId" varchar, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "budget_items"("id", "category", "label", "amount", "stopId", "tripId", "createdAt") SELECT "id", "category", "label", "amount", "stopId", "tripId", "createdAt" FROM "temporary_budget_items"`);
        await queryRunner.query(`DROP TABLE "temporary_budget_items"`);
        await queryRunner.query(`ALTER TABLE "trip_stops" RENAME TO "temporary_trip_stops"`);
        await queryRunner.query(`CREATE TABLE "trip_stops" ("id" varchar PRIMARY KEY NOT NULL, "cityName" varchar NOT NULL, "cityId" varchar, "region" varchar, "state" varchar, "arrivalDate" date NOT NULL, "departureDate" date NOT NULL, "orderIndex" integer NOT NULL DEFAULT (0), "activities" text, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "trip_stops"("id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt") SELECT "id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt" FROM "temporary_trip_stops"`);
        await queryRunner.query(`DROP TABLE "temporary_trip_stops"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`DROP TABLE "trip_notes"`);
        await queryRunner.query(`DROP TABLE "packing_items"`);
        await queryRunner.query(`DROP TABLE "budget_items"`);
        await queryRunner.query(`DROP TABLE "trip_stops"`);
    }

}
