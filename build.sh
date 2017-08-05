#!/usr/bin/env bash
ng build --prod --aot=false
mv dist/assets/idashboard.appcache dist/
mv dist/assets/manifest.webapp dist/
cd dist
zip -r -D idashboard2.zip .
echo "App built"
