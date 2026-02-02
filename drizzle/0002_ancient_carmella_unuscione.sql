CREATE TABLE `studentStatistics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL,
	`totalAttempts` int NOT NULL DEFAULT 0,
	`totalCorrect` int NOT NULL DEFAULT 0,
	`averageAccuracy` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentStatistics_id` PRIMARY KEY(`id`)
);
