# climate-change-lab

## Development

### Requirements

Requires node.js 6.2.0+ and npm 3.8+ for angular compatibility.

### Setup

  - Clone this repo and run `npm install`
  - `cp example/constants.ts.example src/app/constants.ts`
  - Edit `constants.ts` to set the API server name and API key


### Getting started

| Command | Purpose | Use When ... |
|------|---------|--------------|
| `npm start` | Serve project using hot module replacement | For quick browser updating without refresh |
| `npm run server:dev` | Serve project normally, without hot module replacement | If you don't want hot module replacement |
| `npm run lint --silent` | Run typescript linter | To clean up your angular and .ts files |
| `npm run build:prod` | Build production version of application | When ready to deploy |

Navigate to http://localhost:3100 in your browser

Additional commands available in package.json

### Deployment

First, build the application via `npm run build:prod`. The static site will be built in the `dist/` directory.

Then, copy the dist folder to whatever webserver you want to serve the application from.

TODO: Add s3_website how-to
