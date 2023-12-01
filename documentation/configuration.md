## configrations

Run the following command to setup your database. This also creates the User and Todo tables that are defined in prisma/schema.prisma:

> npx prisma migrate dev --name init


### Database configurations
creating user, databases needed for development
```sql

-- create a user you will use to connect to the database
CREATE USER your_username WITH PASSWORD 'your_password';
-- create the main database
CREATE DATABASE your_database_name;
-- create the shadow database for prisma
CREATE DATABASE shadow_database_name;
-- # // grant permision on the main database to the user
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
--grant privledges on your shadow database to the user
-- # // grant permision on the main database to the user
GRANT ALL PRIVILEGES ON DATABASE shadow_database_name TO your_username;


```

### after changing prisma schema file run to update the schema

> npx prisma migrate dev

put these variables inside your .env file by changing the keys to your actual values you used 
> you need to replace these fields
your_username
your_password
your_database_name
---
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name?schema=Public"
SHADOW_DATABASE_URL="postgresql://your_username:your_password@localhost:5432/shadow_database_name?schema=Public"
<!-- the actual node env, dev, or production or test -->
NODE_ENV=dev