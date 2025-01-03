-- 1. create DB
sqlite3 mySQLiteDB.db

-- 2. create tables
CREATE TABLE IF NOT EXISTS Categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Expense', 'Income'))
);

CREATE TABLE IF NOT EXISTS Transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  amount REAL NOT NULL,
  date INTEGER NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('Expense', 'Income')),
  FOREIGN KEY (category_id) REFERENCES Categories (id)
 );

-- 3. insert data
-- Income Categories
INSERT INTO Categories (name, type) VALUES ('Salary', 'Income');
INSERT INTO Categories (name, type) VALUES ('Freelancing', 'Income');
INSERT INTO Categories (name, type) VALUES ('Investments', 'Income');
INSERT INTO Categories (name, type) VALUES ('Gifts', 'Income');
INSERT INTO Categories (name, type) VALUES ('Refunds', 'Income');
INSERT INTO Categories (name, type) VALUES ('Side Hustles', 'Income');
INSERT INTO Categories (name, type) VALUES ('Other', 'Income');

-- Expense Categories
INSERT INTO Categories (name, type) VALUES ('Utilities', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Housing', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Groceries', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Transportation', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Entertainment', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Dining', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Health', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Education', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Subscriptions', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Shopping', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Travel', 'Expense');
INSERT INTO Categories (name, type) VALUES ('Miscellaneous', 'Expense');


-- 4. confirm data was inserted
select * from Categories;
-- 1|Groceries|Expense
-- 2|Rent|Expense
-- 3|Salary|Income
-- 4|Freelancing|Income

-- Expenses
-- January 2025
INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (10, 50.00, 1704105600, 'Groceries for the week', 'Expense');
INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (9, 1500, 1704192000, 'Rent for January', 'Expense');
INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (11, 100.00, 1704278400, 'Transportation expenses', 'Expense');

-- Income
-- January 2025
INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (1, 2500, 1703971200, 'Salary for January', 'Income');
INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (2, 600, 1704057600, 'Freelancing contract payment', 'Income');
INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (6, 150, 1704144000, 'Side hustle payment', 'Income');


-- 5. confirm again
select * from Transactions;
-- 1|1|100.5|2023-01-10|Weekly groceries|Expense
-- 2|1|75.25|2023-01-17|More groceries|Expense
-- 3|2|1200.0|2023-01-01|Monthly rent|Expense
-- 4|1|45.99|2023-01-24|Snacks and drinks|Expense
-- 5|3|3000.0|2023-01-15|Monthly salary|Income
-- 6|4|500.0|2023-01-20|Freelance project|Income

-- 6. exit db
.quit