USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("My Little Pony Doll", "Collectibles", 19.99, 43),
("Lizzie McGuire Doll", "Collectibles", 32.99, 78),
("Floral Bed Set", "Bedding", 45.99, 102),
("Mickey Mouse Vintage T-Shirt", "Clothing", 9.99, 21),
("Donald Duck Vintage T-Shirt", "Clothing", 9.99, 33),
("Dinosaur Kids Bed Set", "Bedding", 35.99, 56);

SELECT * FROM products;
