CREATE TABLE Sprint (
    id TEXT PRIMARY KEY,
    title TEXT
);

CREATE TABLE Action (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    sprintId TEXT REFERENCES Sprint (id),
    userId TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    payload JSONB
);

CREATE INDEX action_sprintid_index ON Action (sprintId);
CREATE INDEX action_timestamp_index ON Action (timestamp);

create or replace function public.after_insert_action() returns trigger as $$
begin
perform pg_notify(
    replace('postgraphile:$1:actions', '$1', NEW.sprintId),
    json_build_object(
        '__node__', json_build_array('Action', NEW.id)
    )::text
);
return NEW;
end;
$$ language plpgsql;

CREATE TRIGGER _500_action_dispatch
  AFTER INSERT ON public.Action
  FOR EACH ROW
  EXECUTE PROCEDURE public.after_insert_action();