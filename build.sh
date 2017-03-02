#!/usr/bin/env bash
ng build --prod --aot=false
mv dist/assets/manifest.webapp dist/
cp -r dist/* /opt/dhis/config/apps/idashboard2/
