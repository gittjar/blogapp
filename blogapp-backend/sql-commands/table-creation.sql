CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    username NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(100) NOT NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME()
);

CREATE TABLE blogs (
    id INT PRIMARY KEY IDENTITY(1,1),
    author NVARCHAR(255),
    url NVARCHAR(255) NOT NULL,
    title NVARCHAR(255) NOT NULL,
    likes INT DEFAULT 0,
    userid INT,
    FOREIGN KEY (userid) REFERENCES users(id)
);


CREATE TABLE reading_list (
  id INT PRIMARY KEY,
  user_id INT FOREIGN KEY REFERENCES users(id),
  blog_id INT FOREIGN KEY REFERENCES blogs(id),
  is_read BIT DEFAULT 0
);

