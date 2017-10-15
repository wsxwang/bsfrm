//var sqlite3 = require('sqlite3');

var readTable=function (db, tbl) {
    console.log(db);
    console.log(tbl);

}

/*
var readTable=function (db, tbl) {
    console.log(db);
    console.log(tbl);
    var db = new sqlite3.Database(db, function (err) {
        if (err){
            console.log('FAIL on open database ' + err);
            return null;
        }
        else {
            db.all('SELECT * from ' + tbl, function (err, record) {
                if (err){
                    console.log('FAIL on open database ' + err);
                    return null;
                }
                else{
                    console.log(record);
                }
            });
        }
    });
};
export default {
    readTable,
};
*/

module.exports = {
    readTable,
};
/*
var db = new sqlite3.Database('/tmp/1.db',function() {
    db.run("create table test(name varchar(15))",function(){
        db.run("insert into test values('hello,world')",function(){
            db.all("select * from test",function(err,res){
                if(!err)
                    console.log(JSON.stringify(res));
                else
                    console.log(err);
            });
        })
    });
});
*/