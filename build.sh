#!/usr/bin/env bash
ng build --prod --aot=false
mv dist/assets/manifest.webapp dist/
rsync -a --progress dist/* /opt/dhis/config/apps/idashboard2/
