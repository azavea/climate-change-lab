# climate-change-lab

## Development

### Requirements

Requires node.js 6.11+ and yarn 0.24.0+ for Angular CLI compatibility.

Alternatively, you can bring up the vagrant VM that has the dependencies installed.

### Setup

If your development host machine meets the requirements above, simply:

  - Clone this repo and run `yarn install`
  - `cp example/constants.ts.example src/app/constants.ts`
  - Edit `constants.ts` to set the API server name and API key
  - `yarn run serve`

The site will then be available at [http://localhost:4200](http://localhost:4200) on your host machine.

### Setup via Vagrant VM

_Recommended only if you don't have the requirements above installed on your host system and are unable to install. If you do, strongly consider instructions in #Setup instead._

Requires ansible 2.2+.

To use the vagrant machine, first start and provision it with:
```bash
./scripts/setup
```

Then to start the development server within the VM:

```bash
vagrant ssh
./scripts/server --vm # Replaces `npm run serve` to include VM specific serve options
```

The site will then be available at [http://localhost:4200](http://localhost:4200) on your host machine.


within the environment (host or VM) before running other build scripts in that environment.

### Getting started

| Command | Purpose | Use When ... |
|------|---------|--------------|
| `scripts/update` | Update project dependencies | |
| `scripts/server` | Serve project in dev mode using Angular CLI | For quick browser updating with refresh |
| `scripts/test` | Run project tests | |
| `scripts/console` | Run commands inside of a container | |
| `scripts/cibuild` | Build production version of application | Before deploying |
| `scripts/infra` | Apply terraform changes and deploy static site | When ready to deploy |

Navigate to [http://localhost:4200](http://localhost:4200) in your browser.

Additional commands available in package.json.

### Deployment

First, build the application via `scripts/cibuild`. The static site will be built in the `dist/_site` directory.

Before publishing, ensure the correct `apiHost` is set for the target environment in `src/app/constants.ts` (staging host, or production).

Push changes to the staging site with docker-compose:

```bash
# staging
$ export CC_SETTINGS_BUCKET=staging-us-east-1-climate-lab-config
$ export CC_SITE_BUCKET=staging-us-east-1-climate-lab-site
# OR production
$ export CC_SETTINGS_BUCKET=production-us-east-1-climate-lab-config
$ export CC_SITE_BUCKET=production-us-east-1-climate-lab-site
# Plan and push changes
$ docker-compose -f docker-compose.ci.yml run --rm terraform scripts/infra plan
$ docker-compose -f docker-compose.ci.yml run --rm terraform scripts/infra apply
```
