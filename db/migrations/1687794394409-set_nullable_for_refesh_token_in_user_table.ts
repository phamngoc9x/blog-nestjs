import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNullableForRefeshTokenInUserTable1687794394409 implements MigrationInterface {
    name = 'SetNullableForRefeshTokenInUserTable1687794394409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
