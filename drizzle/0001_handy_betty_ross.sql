CREATE TABLE `leaderboardScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leaderboardScores_id` PRIMARY KEY(`id`)
);
