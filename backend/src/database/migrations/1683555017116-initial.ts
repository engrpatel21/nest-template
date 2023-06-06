import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1683555017116 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_modified_column()
            RETURNS TRIGGER AS $$
            BEGIN
            NEW.updated_at = now();
            RETURN NEW;
            END;
            $$ language 'plpgsql';
        `)

        queryRunner.query(`
            CREATE SCHEMA IF NOT EXISTS rento
        `)

        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
