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

useage:
    "npm start" fro web server start
    "npm test" for test

component custom_er:custom entity-relation model
    /src/api/custom_entity.js: custom entity api
    /src/api/custom_relation.js: custom entity api
    /routes/custom_entity.js: route restful api "http://xxx/api/custom_entity", "http://xxx/api/custom_entity/:entityID/fields", "http://xxx/api/custom_entity/fields"
    /routes/custom_relation.js: route restful api "http://xxx/api/custom_relation"
    /routes/custom_data.js: route restful api "http://xxx/api/custom_data/:entity-name/"
    /test/custom_er_Test.js: test script
	entity meta-data:{
		name:'unique notnull string as entity name',
		label:'string notnull as entity label',
		title:'string as entity remark',
		fields:[
			{
				name:'string notnull as column name',
				label:'string notnull as column shown label',
				type:'string notnull as column type',
				title:'string as column remark'
			},
			{},
			...
		],
	}



webserice api:
http://xxx/api/users
http://xxx/api/custom_entity
http://xxx/api/custom_relation
