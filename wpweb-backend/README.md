#backend
bin/www: entry
public: mount on $root
public/db: database files
public/htmls: html files
public/images: picture files
public/javascripts: js files
public/ttfs: font files
routes: express router files
src: code files
src/api: api files, restful webservice style, mount on "/api/"
src/cmp: components files,
test: test files
app.js: main
config.json:config file, log config...

useage:
    "npm start" fro web server start
    "npm test" for test

component custom_er:custom entity-relation model
    /src/api/custom_entity.js: custom entity api
    /routes/custom_entity.js: route restful api "http://xxx/api/custom_entity", "http://xxx/api/custom_entity/:entityName", "http://xxx/api/custom_entity/names"
	entity meta-data: described in /src/api/custom_entity.js

	/src/api/custom_entity_data.js: custom entity data access api
    /routes/custom_entity_data.js: route restful api "http://xxx/api/custom_data/:entity-name/"
	
    /src/api/custom_relation.js: custom entity api
    /routes/custom_relation.js: route restful api "http://xxx/api/custom_relation"
	
    /test/custom_er_Test.js: test script



webserice api:
http://xxx/api/users
http://xxx/api/custom_entity
http://xxx/api/custom_data
http://xxx/api/custom_relation
