# Collector - Backend
## Project setup

```bash
$ pnpm install
```

## Postgres

Install the Postgres Database by following this tutorial : https://www.w3schools.com/postgresql/postgresql_install.php

## Env

Duplicate the `.env.exemple` to `.env` and complete it.

## Migrations

Once you installed to database and setup the .env, run the migrations :
```bash
$ pnpm migrations:run
```

## Compile and run the project

```bash
# development
$ pnpm start

# watch mode
$ npm run start:dev
```

Access the Swagger with `http://localhost:8000/api`

## Run tests

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

---

You should install the Front to complete the app : https://github.com/zHatsuharu/collector

---

More documentation :

- Cahier de recette : [RECETTES.md](https://github.com/zHatsuharu/collector-back/blob/main/RECETTES.md)
- Securité : [SECURITY.md](https://github.com/zHatsuharu/collector/blob/main/SECURITY.md)
