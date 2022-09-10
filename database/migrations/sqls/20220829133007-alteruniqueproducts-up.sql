/* Replace with your SQL commands */

DROP INDEX IF EXISTS unique_product;

CREATE UNIQUE INDEX unique_product on products(name,seller_id,category)
WHERE archived_at IS NULL;

