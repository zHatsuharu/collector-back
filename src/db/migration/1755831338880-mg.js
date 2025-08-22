/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Mg1755831338880 {
    name = 'Mg1755831338880'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "quantity" SET DEFAULT '1'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "quantity" DROP DEFAULT`);
    }
}
