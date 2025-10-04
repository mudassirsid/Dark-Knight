-- DROP TABLES if they exist (start fresh)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS turfs;
DROP TABLE IF EXISTS users;

-- USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('manager','customer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TURFS TABLE
CREATE TABLE turfs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  manager_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
);


-- BOOKINGS TABLE
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  turf_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('pending','accepted','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (turf_id) REFERENCES turfs(id) ON DELETE CASCADE
);
