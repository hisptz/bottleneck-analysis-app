#!/usr/bin/env bash
ng build --prod
mv dist/assets/manifest.webapp dist/
rsync -a --progress dist/* /home/dhis/config/apps/idashboard2/
