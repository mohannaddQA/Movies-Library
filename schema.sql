DROP TABLE IF EXISTS movies_table;
CREATE TABLE IF NOT EXISTS movies_table (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    poster VARCHAR(255),
    summary TEXT,
    rate numeric,
    comments TEXT
 
);