# Admin Creation Script

This directory contains scripts to add an admin user directly to the database.

## Adding an Admin User

The script `addAdmin.js` will create an admin user with the following credentials:
- Email: hero2911321@gmail.com
- Password: 12345678

### Prerequisites

- Ensure MongoDB is running and accessible
- Make sure your `.env` file contains the `MONGODB_URI` variable pointing to your MongoDB instance

### Running the Script

There are two ways to run the script:

#### Method 1: Using npm

Add the following to your `package.json` file in the `scripts` section:

```json
"scripts": {
  ...
  "add-admin": "node --experimental-specifier-resolution=node ./scripts/addAdmin.js"
}
```

Then run:

```bash
npm run add-admin
```

#### Method 2: Using the run-add-admin.js script

Make the script executable first:

```bash
chmod +x ./scripts/run-add-admin.js
```

Then run:

```bash
./scripts/run-add-admin.js
```

### Expected Output

If successful, you should see output similar to:

```
Connected to MongoDB
Admin created successfully:
{
  name: 'Admin User',
  email: 'hero2911321@gmail.com',
  role: 'admin',
  id: '...'
}
```

If an admin with the same email already exists, you'll see:

```
Connected to MongoDB
Admin with this email already exists!
```

## Using Admin Account

Once created, you can log in to the admin panel using:
- Email: hero2911321@gmail.com
- Password: 12345678

Go to the admin login page at `/admin-login` route. 