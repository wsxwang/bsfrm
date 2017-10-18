var assert = require('assert');
var fs = require('fs');
var db= require('../src/cmp/dbOpr_sqlite');

describe('dbOpr_sqlite', function () {
	describe('test', function(){
		const dbName = './__testdb__.db';	//':memory:';
		
		after(function(){
			fs.unlink(dbName, function(err){
                assert(err==null, err);
			});
		});
		
		it('invalid sql', function(done){
            db.execBatch(dbName, ["aaa"], function (err) {
                assert(err!=null, "error should occur");
                done();
            });
		});

		it('create table and insert', function(done){
			db.execBatch(dbName,[
				"CREATE TABLE IF NOT EXISTS TBL_TEST (fn number, fs varchar2(255))",
                "INSERT INTO TBL_TEST (fn,fs) VALUES(1, 'a')",
                ],function(err){
			        assert(err==null, err);
			        done();
				});
		});
		
		it('query all', function (done) {
            db.queryAll(dbName, "select * from TBL_TEST", function (err, rows) {
                assert(err==null, err);
                assert.deepEqual(rows.length, 1, "row count doesn't match");
                assert.deepEqual(rows[0]['fn'], 1, "col fn doesn't match");
                assert.deepEqual(rows[0]['fs'], 'a', "col fs doesn't match");
                done();
            })
        });
	});
});
