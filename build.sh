#!/usr/bin/env bash
ng build --bh /
mv dist/assets/manifest.webapp dist/
cp -r dist/* /home/dhis/config/apps/newApp/
