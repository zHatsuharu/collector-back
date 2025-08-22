/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Mg1755834299414 {
    name = 'Mg1755834299414'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" ADD "image" character varying NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "image"`);
    }
}
