# ws-product-nodejs

This repository contains my solutions to requirements 1 and 2a presented in the EQ Works Product Developer work sample.

The distinguishing feature of this implementation is the extent to which it is dynamic. The client-side implementation makes significant use of one-way data binding to make for a very scaleable solution.

`/backend` contains the source code for the rate-limited API which is currently live on [api.kylegrimsrudma.nz](https://api.kylegrimsrudma.nz).

`/frontend` contains the Vue source code for the website which is currently live on [eqworks.kylegrimsrudma.nz](https://eqworks.kylegrimsrudma.nz).

## Installation
If you wish to run either of these components locally, take the following steps.

### `/backend`
```bash
docker-compose up -d
```

### `/frontend`
```bash
npm i
npm run serve
```
