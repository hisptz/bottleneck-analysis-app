#!/usr/bin/env bash
ng build --prod
mv dist/assets/manifest.webapp dist/
cp -r dist/* /home/dhis/config/apps/newApp/
