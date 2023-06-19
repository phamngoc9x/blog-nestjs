import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailColumnTo_userTable1687102939624 implements MigrationInterface {
    name = 'AddEmailColumnTo_userTable1687102939624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
