#!/bin/bash

# The constants.ts file is templated in the jenkins build configuration
# The ENV for the s3_website deploy is set in the jenkins build configuration

set -e
set -x

vagrant up && vagrant ssh -c "
  cd /vagrant
  source .env
  npm install
  npm rebuild node-sass
  npm run build:prod
  s3_website push
"
