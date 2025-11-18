ALTER TABLE `products` ADD `seller_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `role`;