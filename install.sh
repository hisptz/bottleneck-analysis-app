#!/usr/bin/env bash
echo "Pulling codes for the main repository"
git pull

echo "Pulling codes for data filter component"
cd src/app/data-filter
git pull

echo "Pulling codes for period filter component"
cd ../period-filter
git pull

echo "Pulling codes for menu component"
cd ../menu
git pull
cd ../../../

echo "Downloading dependencies from npm.."
npm install
