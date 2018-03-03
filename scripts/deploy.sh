echo "Install the app into DHIS hisptz"
cd dist
curl -X POST -u admin:district -F file=@idashboard-21.zip https://play.hisptz.org/28/api/apps
echo "app installed into DHIS"