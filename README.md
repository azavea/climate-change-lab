# climate-change-lab

## Development

### Requirements

Requires node.js 6.11+ and npm 3.10.10+ for Angular CLI compatibility.

Alternatively, you can bring up the vagrant VM that has the dependencies installed.

### Setup

If your development host machine meets the requirements above, simply:

  - Clone this repo and run `npm install`
  - `cp example/constants.ts.example src/app/constants.ts`
  - Edit `constants.ts` to set the API server name and API key
  - `npm run serve`

The site will then be available at [http://localhost:4200](http://localhost:4200) on your host machine.

### Setup via Vagrant VM

_Recommended only if you don't have the requirements above installed on your host system and are unable to install. If you do, strongly consider instructions in #Setup instead._

To use the vagrant machine, first start it with:
```bash
vagrant up
```

Then to start the development server within the VM:

```bash
vagrant ssh
cd /vagrant
npm run serve:vm  # Replaces `npm run serve` to include VM specific serve options
```

The site will then be available at [http://localhost:4200](http://localhost:4200) on your host machine.

Note that if your host OS differs from the VM, you may need to run

```
npm rebuild node-sass
```

within the environment (host or VM) before running other build scripts in that environment.

### Getting started

| Command | Purpose | Use When ... |
|------|---------|--------------|
| `npm run serve` | Serve project in dev mode using Angular CLI | For quick browser updating with refresh |
| `npm run lint` | Run typescript linter | To clean up your angular and .ts files |
| `npm run test` | Run project tests | |
| `npm run build:prod` | Build production version of application | When ready to deploy |

Navigate to [http://localhost:4200](http://localhost:4200) in your browser.

Additional commands available in package.json.

### Deployment

_All deployment steps should be done within the vagrant vm provided with this project. The vm is provisioned with the tools necessary to deploy._

First, build the application via `npm run build:prod`. The static site will be built in the `dist/` directory.

Copy the environment file with `cp .env.example .env` and add your AWS access/secret keys and CloudFront distribution ID to it.

Push changes to the site with `s3_website push`
