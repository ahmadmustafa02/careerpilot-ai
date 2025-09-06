CREATE TABLE "historyTable" (
	"recordId" varchar NOT NULL,
	"content" json,
	"user_email" varchar,
	"aiAgentType" varchar,
	"createdAt" varchar,
	"metaData" varchar
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
