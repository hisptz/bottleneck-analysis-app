#!/usr/bin/env bash
ng build --prod --aot
mv dist/assets/idashboard.appcache dist/
mv dist/assets/manifest.webapp dist/
echo "App built"
