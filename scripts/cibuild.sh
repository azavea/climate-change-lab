#!/bin/bash
set -e

vagrant up --provision
vagrant ssh -c "cd /vagrant"

echo -e "\nRunning linter..."
# run linter with console output
npm run lint

# run linter with file output for Jenkins
npm run lint:ci

echo -e '\nRunning tests...'
npm run test

echo -e "\nAll done!"
