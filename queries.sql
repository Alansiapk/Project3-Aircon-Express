--create new user for application
--creating new user named 'foo' with password 'bar'

CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY "bar";

GRANT ALL PRIVILEGES on *.* to 'foo'@'%';

FLUSH PRIVILEGES;