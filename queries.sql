--create new user for application
--creating new user named 'foo' with password 'bar'

CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY "bar";

GRANT ALL PRIVILEGES on *.* to 'foo'@'%';

FLUSH PRIVILEGES;

--insert some products

INSERT INTO products (name, cost, description) VALUES
("Daikin iSmile Eco Series", 3000, "System 3 for 3 room flat, 2 bedroom and 1 living"),
("Mitsubishi StarMax Series", 3400, "System 4 for 3 room flat, 3 bedroom and 1 living"),
("LG ArtCool Series", 2800, "System 3 for 3 room flat, 2 bedroom and 1 living");

INSERT INTO brands (name) VALUES
("Daikin"), ("Mitsubishi"), ("LG"), ("Media"), ("Toshiba");