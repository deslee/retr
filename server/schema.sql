CREATE TABLE Sprint (
    id TEXT PRIMARY KEY,
    title TEXT
);

CREATE TABLE Action (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    sprintId TEXT REFERENCES Sprint (id),
    timestamp TIMESTAMP NOT NULL,
    payload JSONB
);

CREATE INDEX action_sprintId_index ON Action (sprintId);
CREATE INDEX action_timestamp_index ON Action (timestamp);