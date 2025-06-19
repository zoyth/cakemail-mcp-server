#!/bin/bash

echo "Running test coverage with corrected setup..."

export NODE_OPTIONS='--experimental-vm-modules --no-warnings'
npm run test:coverage
