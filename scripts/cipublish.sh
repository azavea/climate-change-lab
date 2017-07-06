#!/bin/bash
set -ex

vagrant ssh -c "cd /vagrant

    echo -e '\nBuilding production site...''
    npm run build:prod

    echo -e '\nPublishing to s3...'
    s3_website push --config-dir=${S3_WEBSITE_CONFIG_DIR}
"
