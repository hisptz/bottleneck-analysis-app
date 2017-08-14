#!/usr/bin/env bash
ng build --prod --aot=false
mv dist/assets/idashboard.appcache dist/
mv dist/assets/manifest.webapp dist/
cd dist
#zip -r -D malariaV2.zip .
zip -r -D idashboard2.zip .
curl -X POST -u system:System123 -F file=@idashboard2.zip https://play.dhis2.org/demo/api/apps
echo "App built"
