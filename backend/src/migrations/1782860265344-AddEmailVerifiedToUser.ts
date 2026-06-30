import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddEmailVerifiedToUser1782860265344 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasEmailVerified = await queryRunner.hasColumn("users", "emailVerified");
        if (!hasEmailVerified) {
            await queryRunner.addColumn("users", new TableColumn({
                name: "emailVerified",
                type: "boolean",
                default: false
            }));
        }

        const hasPendingEmail = await queryRunner.hasColumn("users", "pending_email");
        if (!hasPendingEmail) {
            await queryRunner.addColumn("users", new TableColumn({
                name: "pending_email",
                type: "varchar",
                isNullable: true
            }));
        }

        const hasVerifyToken = await queryRunner.hasColumn("users", "email_verify_token");
        if (!hasVerifyToken) {
            await queryRunner.addColumn("users", new TableColumn({
                name: "email_verify_token",
                type: "varchar",
                isNullable: true
            }));
        }

        const hasVerifyExpires = await queryRunner.hasColumn("users", "email_verify_expires");
        if (!hasVerifyExpires) {
            await queryRunner.addColumn("users", new TableColumn({
                name: "email_verify_expires",
                type: "datetime",
                isNullable: true
            }));
        }

        // Backfill step requested by user
        await queryRunner.query(`UPDATE "users" SET "emailVerified" = true WHERE "emailVerified" = false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "email_verify_expires");
        await queryRunner.dropColumn("users", "email_verify_token");
        await queryRunner.dropColumn("users", "pending_email");
        await queryRunner.dropColumn("users", "emailVerified");
    }
}
