import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialEntity1685466548195 implements MigrationInterface {
    name = 'InitialEntity1685466548195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rento"."category" ("category_id" SERIAL NOT NULL, "category" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "categor_unique_name" UNIQUE ("category"), CONSTRAINT "PK_cc7f32b7ab33c70b9e715afae84" PRIMARY KEY ("category_id"))`);
        await queryRunner.query(`CREATE TABLE "rento"."product_photo" ("product_photo_id" SERIAL NOT NULL, "product_id" integer NOT NULL, "s3_bucket" character varying(255), "s3_key" character varying(255), "s3_link" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2b60c612239a8028c002e051749" PRIMARY KEY ("product_photo_id"))`);
        await queryRunner.query(`CREATE TABLE "rento"."product" ("product_id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "user_id" integer NOT NULL, "category_id" integer NOT NULL, "price" numeric(10,2) NOT NULL, "description" text NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1de6a4421ff0c410d75af27aeee" PRIMARY KEY ("product_id"))`);
        await queryRunner.query(`CREATE INDEX "product_price_index" ON "rento"."product" ("price") `);
        await queryRunner.query(`CREATE INDEX "product_user_id_index" ON "rento"."product" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "rento"."user_user_role_enum" AS ENUM('member', 'admin', 'provider')`);
        await queryRunner.query(`CREATE TABLE "rento"."user" ("user_id" SERIAL NOT NULL, "first_name" character varying(30) NOT NULL, "last_name" character varying(30) NOT NULL, "display_name" character varying(30) NOT NULL, "user_role" "rento"."user_user_role_enum" NOT NULL DEFAULT 'member', "s3_bucket" character varying(255), "s3_key" character varying(255), "s3_link" character varying(255), "email" character varying(255), "phone_number" character varying(15), "hash" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "user_unique_display_name" UNIQUE ("display_name"), CONSTRAINT "user_unique_phone_number" UNIQUE ("phone_number"), CONSTRAINT "user_unique_email" UNIQUE ("email"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE INDEX "user_display_name_index" ON "rento"."user" ("display_name") `);
        await queryRunner.query(`CREATE INDEX "user_phone_number_index" ON "rento"."user" ("phone_number") `);
        await queryRunner.query(`CREATE INDEX "user_email_index" ON "rento"."user" ("email") `);
        await queryRunner.query(`ALTER TABLE "rento"."product_photo" ADD CONSTRAINT "FK_1c2de10b5b0450dd13db6574cc7" FOREIGN KEY ("product_id") REFERENCES "rento"."product"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rento"."product" ADD CONSTRAINT "FK_3e59a34134d840e83c2010fac9a" FOREIGN KEY ("user_id") REFERENCES "rento"."user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rento"."product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "rento"."category"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            INSERT INTO "rento"."category" ( category )
            VALUES
                ('Farm'),
                ('Auto'),
                ('Home'),
                ('Hardware'),
                ('Garden')
        `)
        //the hash below is p
        await queryRunner.query(`
            INSERT INTO "rento"."user" ( first_name, last_name, display_name, user_role, hash, email, phone_number )
            VALUES 
                (
                    'p', 
                    'p', 
                    'p', 
                    'member', 
                    '$argon2id$v=19$m=65536,t=3,p=4$mNSnABpVnRtK+YSmKndRzw$zFPWTsHTQemDissTXcT8a0bD9mbN9GgRk9A8AJfzWiI', 
                    'test@test.com', 
                    '123456789'
                );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rento"."product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`);
        await queryRunner.query(`ALTER TABLE "rento"."product" DROP CONSTRAINT "FK_3e59a34134d840e83c2010fac9a"`);
        await queryRunner.query(`ALTER TABLE "rento"."product_photo" DROP CONSTRAINT "FK_1c2de10b5b0450dd13db6574cc7"`);
        await queryRunner.query(`DROP INDEX "rento"."user_email_index"`);
        await queryRunner.query(`DROP INDEX "rento"."user_phone_number_index"`);
        await queryRunner.query(`DROP INDEX "rento"."user_display_name_index"`);
        await queryRunner.query(`DROP TABLE "rento"."user"`);
        await queryRunner.query(`DROP TYPE "rento"."user_user_role_enum"`);
        await queryRunner.query(`DROP INDEX "rento"."product_user_id_index"`);
        await queryRunner.query(`DROP INDEX "rento"."product_price_index"`);
        await queryRunner.query(`DROP TABLE "rento"."product"`);
        await queryRunner.query(`DROP TABLE "rento"."product_photo"`);
        await queryRunner.query(`DROP TABLE "rento"."category"`);
    }

}
