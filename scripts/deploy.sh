echo "Install the app into DHIS hisptz"
cd dist
curl -X POST -u admin:district -F file=@idashboard-21.zip https://play.dhis2.org/demo/api/apps
echo "app installed into DHIS"