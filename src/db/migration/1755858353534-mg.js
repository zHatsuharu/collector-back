/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Mg1755858353534 {
    name = 'Mg1755858353534'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" ADD "name" character varying NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "name"`);
    }
}
