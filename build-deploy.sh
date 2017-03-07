sh build.sh
cd dist
zip -r -D idashboard2.zip *
curl -X POST -u developer:DEVELOPER2016 -F file=@idashboard2.zip http://41.217.202.50:8080/dhis/api/apps
