#!/usr/bin/env bash

git submodule init
git submodule update

cd src/app/modules
#Update menu submodule
echo "Updating menu submodule.."
cd menu
git checkout master
git pull origin master
cd ..

#Update chart submodule
echo "Updating chart submodule.."
cd chart
git checkout master
git pull origin master
cd ..

#Update chart submodule
echo "Updating table submodule.."
cd table
git checkout master
git pull origin master

#Return to root directory
cd ../../../../
