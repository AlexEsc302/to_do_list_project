CREATE TABLE todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    due_date DATE,
    done BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP NULL,
    done_date TIMESTAMP NULL
);
