# IMFO Backend API

>IMFO project with NodeJS + Express + Sequelize ORM.. :heart:

## Table of Contents
- [Tech]
- [Relational Schema]
- [Introduction]
- [Up and Running]
    - [Local Setup]
		- [Docker Setup] (Pending)
		- [EC2 Instance] (Pending)
- [REST API]
	- [Endpoints]
- [Contributing]

<p align="center">
  <img src="divider.png" alt="IMFO" width="400" />
</p>
![divider](divider.png)

## Tech
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework.
* [Mysql] - Sequelize is a promise-based ORM for Node.js
* [Sequelize] -  In addition, we're going to use Sequelize, which is a database [ORM][9] that will interface with the **MySQL**, **PostgreSQL**, **SQLite**, and **MariaDB** databases for us.

## Relational Schema
![divider](app/db/relational-schemas/21-12-2018-schema.png)
## Introduction

Our app directory consists on the following folders

| Directory | Description |
|---|---|
| app/config/  | Contains all of your environments, database configuration and middleware configuations. |
| app/controllers/  | Contains all of our endpoints defination. |
| app/db/migrations  | Your database migrations scripts. Keep this files in Javascript and run `npm run db:migrate` to migrate your database schema. |
| app/models/ | Sequelize entities. |
| app/routes/ | Our endpoints listing. |

First, define your database schema in config/database.js file.
Use [Sequelize CLI](http://docs.sequelizejs.com/en/v3/docs/migrations/) to initialize your database.

In models/ directory, the index.ts file define the DbConnection interface. When you create a new Sequelize entity, add its reference in this interface to fully use Typescript's superpower !
## Up and Running

### Local Setup
Make sure you have [Node.js][3] and the [Mysql] installed.
Install the dependencies and devDependencies and start the server.

```sh
git clone git@git.virtualforce.io:profiles/imfo-api.git # or clone your own fork
cd imfo_api
npm install # To install NodeJS dependencies.
```

```bash
npm install -g yarn
yarn
```

The build tasks use **Gulp tasks runner**. Typescript is transpiled to Javascript in the /build directory.
This app use [Mysql] database but you can easily change it and use your favorite relational database (npm or yarn command) :
```bash
npm install --save mysql // For both mysql and mariadb dialects
npm install --save sqlite3
npm install --save tedious // MSSQL
```
## Environment Variable setup

Export environment variables through terninals
```
* export DATABASE_URL="mysql://username:password@host:3306/database"
* export SECRET="My Secret 64bit"
* export NODE_ENV=production
* export HOST=https://www.imfo.com
* export MAILER_FROM=Sendgrid
* export MAILER_USER=Sendgrid Username
* export MAILER_PASSWORD=Sendgrid password
* export FACEBOOK_APP_ID=Facebook App ID
* export FACEBOOK_APP_SECRET=Facebook App SECRET
```
Or rename the `/env.example` to `.env` update the values file for your environment
```
DATABASE_URL=mysql://username:password@host:3306/database
NODE_ENV=development
SECRET=1234zxcv
HOST=https://www.imfo.com
MAILER_FROM=Sendgrid
MAILER_USER=Sendgrid Username
MAILER_PASSWORD=Sendgrid password
FACEBOOK_APP_ID=Facebook App ID
FACEBOOK_APP_SECRET=Facebook App SECRET
```

The **server/config/environment.ts** file contain our application environment variables, such as database authentication configuration, secret etc. ..

Be sure to update the **server/config/environment.ts** file for your development, test, and production environment or add new environmnet variables:


```
require('dotenv').config();
module.exports = {
   development: {
     DATABASE_URL: 'Test DB Connection String',
     secret: 'Development Secret',
     port: 3000,
     mailer: {
      from: process.env.MAILER_FROM,
      service: process.env.MAILER_SERVICE || 'SendGrid',
      smtp: {
        user: process.env.MAILER_USER,
        password: process.env.MAILER_PASSWORD
      }
    },
    facebookAuth: {
       clientID: process.env.FACEBOOK_APP_ID,
       clientSecret:  process.env.FACEBOOK_APP_SECRET
    }
   },
   test: {
     DATABASE_URL: 'Test DB Connection String',
     secret: 'Testing Secret',
     port: 3000,
      host: process.env.HOST,
      mailer: {
         from: process.env.MAILER_FROM,
         service: process.env.MAILER_SERVICE || 'SendGrid',
         smtp: {
           user: process.env.MAILER_USER,
           password: process.env.MAILER_PASSWORD
         }
      },
      facebookAuth: {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret:  process.env.FACEBOOK_APP_SECRET
      }
   },
   production: {
     DATABASE_URL: process.env.DATABASE_URL,
     secret: process.env.SECRET,
     port: process.env.PORT || 3000,
     host: process.env.HOST,
     mailer: {
        from: process.env.MAILER_FROM,
        service: process.env.MAILER_SERVICE || 'SendGrid',
        smtp: {
          user: process.env.MAILER_USER,
          password: process.env.MAILER_PASSWORD
        }
     },
     facebookAuth: {
       clientID: process.env.FACEBOOK_APP_ID,
       clientSecret:  process.env.FACEBOOK_APP_SECRET
     }
   }
 }
```
If you are just running this locally, using the basic development server, then just update the development config.

----------


## Run the project

```bash
npm start
```
Restful API Flow
--------------------
##### Base URL:  `https://api-imfo.herokuapp.com`
### Endpoints



| Method 			| URI Pattern                 |
| ------------------| --------------------------- |
| `POST`		    | 	/v1/login           |
| `POST`		    | 	/v1/signup               |
| `POST`		    | 	/v1/password/reset          |
| `POST`		    | 	/v1/auth/facebook          |


#### Signup

Post request to `/v1/signup/`
```
{
	"fullName": "Faizan AH",
	"email": "faizan.ahmad@virtualforce.io",
	"password": "password"
}
```

Response
```
{
  "success": true,
	"data":{
	    "id": '3f5614a0-f4a4-11e8-b6b7-771eeb9fc014',
	    "fullName": "Faizan AH",
	    "password": "$2a$10$Ze9c2PFdo6DbYtpyJyZJNutymqI71uhOJkkp5ROcPM.ynbG0dyO",
	    "email": "faizan.ahmad@virtualforce.io",
	    "createdAt": "2018-11-30T07:46:19.173Z",
	    "updatedAt": "2018-11-30T07:46:19.173Z"
	},
	 "message": "Congrats! You have Successfully registerd."
 }
```

#### Login
Using your account credentials you need to create a session to receive a token to authenticate all other API calls.

Post request to`/v1/login/`
```
{
	"email": "faizan.ahmad@virtualforce.io",
	"password": "password"
}
```

Response
```
{
    "success": true,
    "data": {
        "id": "bee3b2e0-f891-11e8-b8c1-933c34245602",
        "fullName": "Faizan Ahmad",
        "avatar": null,
        "phone": null,
        "email": "faizan.ahmad@virualfore.io",
        "createdAt": "2018-12-05T13:29:09.000Z",
        "updatedAt": "2018-12-05T13:29:09.000Z"
    },
    "message": "Congrats! You have successfully login.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhaXphbkBlbmdpbmV0ZWNoLmlvIidsZLyeicvlVN7eWnLuMuOi5E5y-_TYY"
}
```

#### Login with Facebook
Using your account credentials you need to create a session to receive a token to authenticate all other API calls.

Post request to`/v1/auth/login/`
```
{
	"email": "faizan.ahmad@virtualforce.io",
	"access_token": "Facebook Access Token"
}
```

Response
```
{
    "success": true,
    "data": {
        "id": "bee3b2e0-f891-11e8-b8c1-933c34245602",
        "fullName": "Faizan Ahmad",
        "avatar": null,
        "phone": null,
        "email": "faizan.ahmad@virualfore.io",
        "createdAt": "2018-12-05T13:29:09.000Z",
        "updatedAt": "2018-12-05T13:29:09.000Z"
    },
    "message": "Congratulations! Your account has been successfully authorized with facebook.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhaXphbkBlbmdpbmV0ZWNoLmlvIidsZLyeicvlVN7eWnLuMuOi5E5y-_TYY"
}
```

To  authenticate all the request you need to set the Authoization header `-H 'x-access-token: {{token}}'` using your token and send this along with your request.

## Build

```bash
npm run build
```

## Lint your code before you commit!

In a collaborative project, it's always a pain when you have to work on files not correctly formatted.
Now beofre each commit, yout typescript files are linted based on your tsconfig.json >  .editorconfig > tslint.json files.

```bash
λ git commit -m "Example precommit"

> husky - npm run -s precommit

25l[14:22:30] Running tasks for src/**/*.ts [started]
[14:22:30] prettify [started]
[14:22:31] prettify [completed]
[14:22:31] git add [started]
[14:22:31] git add [completed]
[14:22:31] Running tasks for src/**/*.ts [completed]
25h25h[master 23c4321] Example precommit
 1 file changed, 1 insertion(+), 1 deletion(-)
```

By the way you can also run the command with a npm script

```bash
npm run prettify
```

## Roadmap
- [x] Add Sequelize Typescript with association
- [x] Manage multiple database configuration with NODE_ENV
- [x] Add JWT Token based authentication to secure API
- [x] Add subdomain `api.example.com/v*` for **API** and `admin.example.com` for **Admin Panel**
- [ ] Add Admim Panel UI for Reporting
- [ ] Add Swagger UI Documentation
- [ ] Add public pages
#### Support [Virtualforce INC][7]

[![](https://www.virtualforce.io/wp-content/themes/vf/images/vf-logo.svg)](https://www.virtualforce.io)



  [1]: http://docs.sequelizejs.com/manual/tutorial/migrations.html
  [2]: https://github.com/sequelize/cli
  [3]: https://nodejs.org/en/
  [4]: http://docs.sequelizejs.com
  [5]: https://expressjs.com
  [6]: https://www.getpostman.com/docs/postman/launching_postman/navigating_postman
  [9]: https://en.wikipedia.org/wiki/Object-relational_mapping
  [7]: https://www.virtualforce.io
  [8]: https://api-imfo.herokuapp.com
