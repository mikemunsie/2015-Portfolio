#!/bin/bash

# Do a fresh NPM Install for production
npm install --production;

# Install the bower components
bower install --allow-root;

# Run gulp LIVE!
gulp prod;