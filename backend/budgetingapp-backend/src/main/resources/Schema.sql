-- Create Users Table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL, -- Hashed password
    role NVARCHAR(20) DEFAULT 'USER' NOT NULL, -- Roles: USER, ADMIN
    created_at DATETIME DEFAULT GETDATE()
);

-- Create Budgets Table
CREATE TABLE budgets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    category NVARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Transactions Table (Fixed `ON DELETE SET NULL` for budget_id)
CREATE TABLE transactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    budget_id INT NULL, -- Allow NULL to prevent cascade conflict
    description NVARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE SET NULL -- Fix: Avoid multiple cascade paths
);
