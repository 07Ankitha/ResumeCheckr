export function checkDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Please define the DATABASE_URL environment variable inside .env'
    );
  }
  return process.env.DATABASE_URL;
} 