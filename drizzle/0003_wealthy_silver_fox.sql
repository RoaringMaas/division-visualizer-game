CREATE TABLE `studentAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`badgeId` varchar(50) NOT NULL,
	`badgeTitle` varchar(100) NOT NULL,
	`badgeDescription` text NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studentAchievements_id` PRIMARY KEY(`id`)
);
