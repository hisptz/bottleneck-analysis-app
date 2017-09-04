#!/usr/bin/env bash
#Prepare manifest service for building by changing manifest file root url
echo "Modifying manifest service for building";
sed -i -e 's#assets/##g' src/app/providers/manifest.service.ts
#Build the application for production
ng build --prod --aot
#Prepare folder into structure acceptable for installing in DHIS
mv dist/assets/idashboard.appcache dist/
mv dist/assets/manifest.webapp dist/
cd dist
#Compress the file
zip -r -D idashboard2.zip .
#Install the app into DHIS
#curl -X POST -u happynyanda:Happie311291 -F file=@idashboard2.zip https://etl.moh.go.tz/api/apps
echo "App built"
#Restore original state of manifest service
cd ..
sed -i -e 's#manifest#assets/manifest#g' src/app/providers/manifest.service.ts
echo "Manifest service restored to its original state"
