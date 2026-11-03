CREATE TABLE `activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` varchar(32) NOT NULL,
	`type` varchar(60) NOT NULL,
	`title` varchar(180) NOT NULL,
	`detail` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` varchar(32) NOT NULL,
	`name` varchar(180) NOT NULL,
	`handle` varchar(120) NOT NULL,
	`profileUrl` varchar(500) NOT NULL,
	`industry` varchar(120) NOT NULL,
	`subNiche` varchar(180),
	`geography` varchar(120),
	`followerEvidence` varchar(120),
	`stage` enum('discovery','screening','qualified','outreach','replied','partnership','product','launch','live','archived') NOT NULL DEFAULT 'discovery',
	`qualificationScore` int NOT NULL DEFAULT 0,
	`confidence` enum('high','medium','low','unknown') NOT NULL DEFAULT 'unknown',
	`researchStatus` enum('unverified','profile_verified','deep_research','audit_complete') NOT NULL DEFAULT 'unverified',
	`approvalStatus` enum('not_ready','needs_review','approved','paused') NOT NULL DEFAULT 'not_ready',
	`tags` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creators_id` PRIMARY KEY(`id`),
	CONSTRAINT `creators_creatorId_unique` UNIQUE(`creatorId`)
);
