## configrations

Run the following command to setup your database. This also creates the User and Todo tables that are defined in prisma/schema.prisma:

npx prisma migrate dev --name init


### Create database and connect

```sql
CREATE DATABASE your_database_name;
CREATE USER new_username WITH PASSWORD 'new_password';
CREATE ROLE your_role;
# // grant permision to the role
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_role;
//# grant role to username
GRANT your_role TO your_username;

```

# when changing code run

npx prisma migrate dev