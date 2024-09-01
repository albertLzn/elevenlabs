#!/bin/sh
set -e

# Wait for the MySQL service to be ready
host="$DB_HOST"
user="$DB_USER"
password="$DB_PASSWORD"
dbname="$DB_NAME"

until mysql -h "$host" -u "$user" -p"$password" -e "use $dbname"; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 3
done

# Check if the database is empty
TABLES=$(mysql -h "$host" -u "$user" -p"$password" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$dbname';" -s -N)

if [ "$TABLES" -eq 0 ]; then
  >&2 echo "Database is empty - running migrations and seeds"

  # Run migrations
  npm run migrate

  # Run seeds
  npm run seed

  >&2 echo "Migrations and seeds completed"
fi

# Start the application
exec "$@"
