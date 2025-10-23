delete process.env.TRIVIA_ADMIN_EMAIL;
delete process.env.TRIVIA_ADMIN_PASSWORD;
process.env.NODE_ENV = 'test';
process.env.SQLITE_DB = process.env.SQLITE_DB || ':memory:';
process.env.DEBUG_HIDE_DATE = 'true';
process.env.DEBUG_COLORS = 'true';
