/* Replace with your SQL commands */

DROP INDEX IF EXISTS unique_user_image;

CREATE UNIQUE INDEX unique_user_image on user_images(user_id)
WHERE archived_at IS NULL;

