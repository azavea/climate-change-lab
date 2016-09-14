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

Navigate to [http://localhost:3100](http://localhost:3100) in your browser.

Additional commands available in package.json.

### Tech Stack

Webpack -- is a module bundler for the browser.

Webpack-dev-server -- serves project and watches changes to webpack bundles. Runs with project's npm commands. With hot module reload, changes are reloaded in browser without refresh.

Angular -- still in development, using Angular 2.0.0-rc.5 as the front-end framework

D3 -- javascript library for creating sharp, interactive data analysis visualizations.
