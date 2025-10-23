delete process.env.TRIVIA_ADMIN_EMAIL;
delete process.env.TRIVIA_ADMIN_PASSWORD;
process.env.NODE_ENV = 'test';
process.env.SQLITE_DB = process.env.SQLITE_DB || ':memory:';
