CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products(
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(200),
    department_name VARCHAR(200),
    price NUMERIC,
    stock_quantity NUMERIC,
    product_sales NUMERIC,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES("Apple headphones","Music", 15, 10, 0),
("Undaunted Courage","Books",25,3, 0),
("All the Light We Cannot See", "Books", 17, 4, 0),
("HD TV", "Electronics", 500, 4, 0),
("TV Remote", "Electronics",15, 7, 0), 
("Compost Bucket", "Gardening", 30, 5, 0),
("Fishing Rod", "Outdoors", 100, 10, 0),
("Fishing Reel", "Outdoors", 45, 3, 0),
("Hiking Boots", "Outdoors", 110, 4, 0),
("Shampoo", "Health and Beauty", 30,4, 0);

DROP TABLE IF EXISTS departments;

CREATE TABLE departments(
	department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(200),
    over_head_costs NUMERIC,
    PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("Music", 1000),
("Books", 200),
("Electronics", 1200),
("Gardening", 400),
("Outdoors", 1000),
("Health and Beauty", 300);


