#!/usr/bin/env bash
ng build --prod --aot
mv dist/assets/idashboard.appcache dist/
mv dist/assets/manifest.webapp dist/
cd dist
#zip -r -D malariaV2.zip .
zip -r -D idashboard2.zip .
curl -X POST -u admin:district -F file=@idashboard2.zip https://scorecard-dev.dhis2.org/demo/api/apps
echo "App built"
