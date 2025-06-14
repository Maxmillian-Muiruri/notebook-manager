echo "setting up book_management DB................"


# create database
psql -q -U postgres -h localhost  -c "CREATE DATABASE note_book;"

#Runmigration
psql -q -U postgres -h localhost -d note_book -f ../src/database/migration/initial_shema.sql

#create stored procedure
psql  -U postgres -h localhost -d note_book -f ../src/database/procedure/procedure-create-books.sql
psql  -U postgres -h localhost -d note_book -f ../src/database/procedure/procedure-get-books.sql
psql  -U postgres -h localhost -d note_book -f ../src/database/procedure/procedure-update-books.sql
psql  -U postgres -h localhost -d note_book -f ../src/database/procedure/procedure-delete-books.sql

echo "Database setup complete......"

echo "you can now run : npm run start:dev"


psql -q -U postgres -h localhost  -c "CREATE DATABASE note_book;"
