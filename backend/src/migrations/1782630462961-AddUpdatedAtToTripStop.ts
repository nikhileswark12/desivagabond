import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtToTripStop1782630462961 implements MigrationInterface {
    name = 'AddUpdatedAtToTripStop1782630462961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_trip_stops" ("id" varchar PRIMARY KEY NOT NULL, "cityName" varchar NOT NULL, "cityId" varchar, "region" varchar, "state" varchar, "arrivalDate" date NOT NULL, "departureDate" date NOT NULL, "orderIndex" integer NOT NULL DEFAULT (0), "activities" text, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_37cc2e3103d3ad66b08b7ba220d" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_trip_stops"("id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt") SELECT "id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt" FROM "trip_stops"`);
        await queryRunner.query(`DROP TABLE "trip_stops"`);
        await queryRunner.query(`ALTER TABLE "temporary_trip_stops" RENAME TO "trip_stops"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip_stops" RENAME TO "temporary_trip_stops"`);
        await queryRunner.query(`CREATE TABLE "trip_stops" ("id" varchar PRIMARY KEY NOT NULL, "cityName" varchar NOT NULL, "cityId" varchar, "region" varchar, "state" varchar, "arrivalDate" date NOT NULL, "departureDate" date NOT NULL, "orderIndex" integer NOT NULL DEFAULT (0), "activities" text, "tripId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_37cc2e3103d3ad66b08b7ba220d" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "trip_stops"("id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt") SELECT "id", "cityName", "cityId", "region", "state", "arrivalDate", "departureDate", "orderIndex", "activities", "tripId", "createdAt" FROM "temporary_trip_stops"`);
        await queryRunner.query(`DROP TABLE "temporary_trip_stops"`);
    }

}
