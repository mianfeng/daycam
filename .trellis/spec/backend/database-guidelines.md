# Database Guidelines

Daycam has no database, ORM, or migrations.

Use the portable `daycam-data/` folder as the runtime data boundary. Saved
photos live under `daycam-data/photos/`, archived replacements under
`daycam-data/archive/`, and metadata in JSON files.

Do not introduce a database for local photo capture features unless the task
explicitly changes the storage model.
