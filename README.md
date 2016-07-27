# climate-change-lab

## Development

### Requirements

Requires node.js 6.3.1+ and npm 3.10.3+ for angular compatibility.

### Setup

Clone this repo and run `npm install -g`

Check that webpack and webpack-dev-server are globally accessible, otherwise `npm install -g webpack webpack-dev-server`

### Getting started

| Command | Purpose | Use When ... |
|------|---------|--------------|
| `npm start` | Serve project normally | If you don't want hot module replacement |
| `npm run server:dev:hmr` | Serve project using hot module replacement | For quick browser updating without refresh |
| `npm run lint` | Run typscript linter | To clean up your angular and .ts files |

Navigate to http://localhost:3000 in your browser

Additional commands available in package.json

### Tech Stack

Webpack -- is a module bundler for the browser.

Webpack-dev-server -- serves project and watches changes to webpack bundles. Runs with project's npm commands. With hot module reload, changes are reloaded in browser without refresh.

Angular -- still in development, using Angular 2.0.0-rc.4 as the front-end framework

D3 -- javascript library for creating sharp, interactive data analysis visualizations.
