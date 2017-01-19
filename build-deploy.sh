sh build.sh
cd dist
zip -r -D ng2-seed.zip *
curl -X POST -u developer:DEVELOPER2016 -F file=@ng2-seed.zip http://41.217.202.50:8080/dhis/api/apps
