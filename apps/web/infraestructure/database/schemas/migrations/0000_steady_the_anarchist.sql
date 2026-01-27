CREATE TYPE "public"."activity_reported_status" AS ENUM('NO_INICIADA', 'EN_RIESGO', 'COMPLETADA');--> statement-breakpoint
CREATE TYPE "public"."activity_status" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_rule" AS ENUM('AND', 'OR');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_status" AS ENUM('CUMPLIDO', 'EN_PROGRESO', 'NO_CUMPLIDO');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT', 'UNDER_REVIEW', 'APPROVED');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('ACTIVE', 'SEND_FOR_APPROVAL', 'INACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD', 'REJECTED', 'APPROVED', 'REQUEST_CHANGES');--> statement-breakpoint
CREATE TABLE "activity_objective" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer NOT NULL,
	"strategic_objective_id" integer NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"responsible_person" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"actual_start_date" date,
	"actual_end_date" date,
	"planned_duration" integer,
	"progress_percent" numeric(5, 2) DEFAULT '0.00',
	"planned_progress" numeric(5, 2) DEFAULT '0.00',
	"actual_progress" numeric(5, 2) DEFAULT '0.00',
	"executed_budget" numeric(15, 2) DEFAULT '0.00',
	"priority" integer DEFAULT 3 NOT NULL,
	"status" "activity_status" DEFAULT 'PLANNED',
	"reported_status" "activity_reported_status" DEFAULT 'NO_INICIADA',
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"project_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"project_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"target_value" numeric(10, 2) NOT NULL,
	"actual_value" numeric(10, 2),
	"status" "status",
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"indicator_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicator" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_type" text NOT NULL,
	"owner_id" integer NOT NULL,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	"formula" text NOT NULL,
	"baseline" numeric(10, 2) NOT NULL,
	"status" "status",
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "institutional_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"version" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"status" "plan_status",
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"public_entity_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "macro_sector" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "macro_sector_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "micro_sector" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"sector_id" integer NOT NULL,
	CONSTRAINT "micro_sector_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "objective_alignment" (
	"id" serial PRIMARY KEY NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"strategic_objective_id" integer NOT NULL,
	"pnd_objective_id" integer NOT NULL,
	"ods_goal_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ods_goal" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "ods_goal_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "organizational_unit" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"level" integer NOT NULL,
	"status" "status",
	"parent_id" integer NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"public_entity_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pnd_objective" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "pnd_objective_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "program" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"budget" numeric(10, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "status",
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"cup" text NOT NULL,
	"budget" numeric(10, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "project_status",
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"program_id" integer NOT NULL,
	"strategic_objective_id" integer NOT NULL,
	"typology_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_entity" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"goverment_level" text NOT NULL,
	"status" "status",
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"sub_sector_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sector" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"macro_sector_id" integer NOT NULL,
	CONSTRAINT "sector_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "strategic_objective" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"status" "status",
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"fulfillment_rule" "fulfillment_rule" DEFAULT 'AND',
	"fulfillment_status" "fulfillment_status" DEFAULT 'NO_CUMPLIDO',
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"institutional_plan_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "typology" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_by" text,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "typology_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "project_observations" (
	"id" serial PRIMARY KEY NOT NULL,
	"observation" text NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"project_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_mapping" (
	"id" serial PRIMARY KEY NOT NULL,
	"keycloak_id" text NOT NULL,
	"user_name" text NOT NULL,
	CONSTRAINT "users_mapping_keycloak_id_unique" UNIQUE("keycloak_id")
);
--> statement-breakpoint
ALTER TABLE "activity_objective" ADD CONSTRAINT "activity_objective_activity_id_activity_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_objective" ADD CONSTRAINT "activity_objective_strategic_objective_id_strategic_objective_id_fk" FOREIGN KEY ("strategic_objective_id") REFERENCES "public"."strategic_objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_indicator_id_indicator_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicator"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutional_plan" ADD CONSTRAINT "institutional_plan_public_entity_id_public_entity_id_fk" FOREIGN KEY ("public_entity_id") REFERENCES "public"."public_entity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "micro_sector" ADD CONSTRAINT "micro_sector_sector_id_sector_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sector"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objective_alignment" ADD CONSTRAINT "objective_alignment_strategic_objective_id_strategic_objective_id_fk" FOREIGN KEY ("strategic_objective_id") REFERENCES "public"."strategic_objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objective_alignment" ADD CONSTRAINT "objective_alignment_pnd_objective_id_pnd_objective_id_fk" FOREIGN KEY ("pnd_objective_id") REFERENCES "public"."pnd_objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objective_alignment" ADD CONSTRAINT "objective_alignment_ods_goal_id_ods_goal_id_fk" FOREIGN KEY ("ods_goal_id") REFERENCES "public"."ods_goal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizational_unit" ADD CONSTRAINT "organizational_unit_public_entity_id_public_entity_id_fk" FOREIGN KEY ("public_entity_id") REFERENCES "public"."public_entity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_strategic_objective_id_strategic_objective_id_fk" FOREIGN KEY ("strategic_objective_id") REFERENCES "public"."strategic_objective"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_typology_id_typology_id_fk" FOREIGN KEY ("typology_id") REFERENCES "public"."typology"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_entity" ADD CONSTRAINT "public_entity_sub_sector_id_micro_sector_id_fk" FOREIGN KEY ("sub_sector_id") REFERENCES "public"."micro_sector"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sector" ADD CONSTRAINT "sector_macro_sector_id_macro_sector_id_fk" FOREIGN KEY ("macro_sector_id") REFERENCES "public"."macro_sector"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategic_objective" ADD CONSTRAINT "strategic_objective_institutional_plan_id_institutional_plan_id_fk" FOREIGN KEY ("institutional_plan_id") REFERENCES "public"."institutional_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_observations" ADD CONSTRAINT "project_observations_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;