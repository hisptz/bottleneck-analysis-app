#!/usr/bin/env bash

cd src/app/modules
#Update menu submodule

#Update chart submodule
cd chart
git checkout master
git pull origin master
cd ..

#Update chart submodule
cd table
git checkout master
git pull origin master

#Return to root directory
cd ../../../../
