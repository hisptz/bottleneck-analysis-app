#!/usr/bin/env bash
#Install everything first
echo "Installing neccessary files"
sh install.sh

#Build the application for production
echo "Build the application for production"
ng build --prod --aot
npm run precache

#Prepare folder into structure acceptable for installing in DHIS
echo "Prepare folder into structure acceptable for installing in DHIS"
cd dist
#Compress the file
echo "Compressing source codes"
zip -r -D idashboard2.zip .

cd ..
echo "App built"
#sed -i -e 's#manifest#assets/manifest#g' src/app/providers/manifest.service.ts

