import { MigrationInterface, QueryRunner } from "typeorm";

export class TripStopActivities1782635800503 implements MigrationInterface {
    name = 'TripStopActivities1782635800503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trip_stop_activities" ("id" varchar PRIMARY KEY NOT NULL, "stopId" varchar NOT NULL, "activityId" varchar NOT NULL, "addedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_trip_stop_activities" ("id" varchar PRIMARY KEY NOT NULL, "stopId" varchar NOT NULL, "activityId" varchar NOT NULL, "addedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_1d428d502d79996b480fbc51430" FOREIGN KEY ("stopId") REFERENCES "trip_stops" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_962f6405f7ac3d0f28e8f378642" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_trip_stop_activities"("id", "stopId", "activityId", "addedAt") SELECT "id", "stopId", "activityId", "addedAt" FROM "trip_stop_activities"`);
        await queryRunner.query(`DROP TABLE "trip_stop_activities"`);
        await queryRunner.query(`ALTER TABLE "temporary_trip_stop_activities" RENAME TO "trip_stop_activities"`);

        // Data migration
        const crypto = require('crypto');
        const stops = await queryRunner.query(`SELECT id, activities FROM trip_stops WHERE activities IS NOT NULL AND activities != '[]' AND activities != ''`);
        
        for (const stop of stops) {
            try {
                const activities = typeof stop.activities === 'string' ? JSON.parse(stop.activities) : stop.activities;
                for (const act of activities) {
                    if (act.id) {
                        const newId = crypto.randomUUID();
                        await queryRunner.query(
                            `INSERT INTO trip_stop_activities ("id", "stopId", "activityId", "addedAt") VALUES (?, ?, ?, datetime('now'))`,
                            [newId, stop.id, act.id]
                        );
                    }
                }
            } catch (e) {
                console.error('Failed to parse activities for stop', stop.id, e);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trip_stop_activities" RENAME TO "temporary_trip_stop_activities"`);
        await queryRunner.query(`CREATE TABLE "trip_stop_activities" ("id" varchar PRIMARY KEY NOT NULL, "stopId" varchar NOT NULL, "activityId" varchar NOT NULL, "addedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "trip_stop_activities"("id", "stopId", "activityId", "addedAt") SELECT "id", "stopId", "activityId", "addedAt" FROM "temporary_trip_stop_activities"`);
        await queryRunner.query(`DROP TABLE "temporary_trip_stop_activities"`);
        await queryRunner.query(`DROP TABLE "trip_stop_activities"`);
    }

}
