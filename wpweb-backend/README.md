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

webserice api:
http://xxx/api/users
