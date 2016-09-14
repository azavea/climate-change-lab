# climate-change-lab

## Development

### Requirements

Requires node.js 6.2.0+ and npm 3.8+ for angular compatibility.

Alternatively, you can bring up the vagrant VM that has the dependencies installed.

### Setup

  - Clone this repo and run `npm install`
  - `cp example/constants.ts.example src/app/constants.ts`
  - Edit `constants.ts` to set the API server name and API key

To use the vagrant machine, first start it with:
```bash
vagrant up
```

Then to start the development server within the VM:

```bash
vagrant ssh
cd /opt/climate-change-lab
npm start
```

The site will then be available at [http://localhost:3100](http://localhost:3100) on your host machine.

Note that if you are using a Mac host, it may be necessary to run:

```
npm rebuild node-sass
```

to switch between using the VM build and building directly on your host machine.

### Getting started

| Command | Purpose | Use When ... |
|------|---------|--------------|
| `npm start` | Serve project using hot module replacement | For quick browser updating without refresh |
| `npm run server:dev` | Serve project normally, without hot module replacement | If you don't want hot module replacement |
| `npm run lint --silent` | Run typescript linter | To clean up your angular and .ts files |
| `npm run build:prod` | Build production version of application | When ready to deploy |

Navigate to [http://localhost:3100](http://localhost:3100) in your browser.

Additional commands available in package.json.

### Deployment

_All deployment steps should be done within the vagrant vm provided with this project. The vm is provisioned with the tools necessary to deploy_

First, build the application via `npm run build:prod`. The static site will be built in the `dist/` directory.

Copy the environment file with `cp .env.example .env` and add your AWS access/secret keys and CloudFront distribution ID to it.

Push changes to the site with `s3_website push`
