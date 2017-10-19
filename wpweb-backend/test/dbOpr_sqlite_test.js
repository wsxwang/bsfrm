var assert = require('assert');
var fs = require('fs');
var db= require('../src/cmp/dbOpr_sqlite');

describe('dbOpr_sqlite', function () {
	describe('use sqlite3 asynchronous', function(){
		const dbName = './__testdb_async_.db';
		
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
            db.queryAll(dbName, "SELECT * FROM TBL_TEST", function (err, rows) {
                assert(err==null, err);
                assert.deepEqual(rows.length, 1, "row count doesn't match");
                assert.deepEqual(rows[0]['fn'], 1, "col fn doesn't match");
                assert.deepEqual(rows[0]['fs'], 'a', "col fs doesn't match");
                done();
            })
        });
	});

	describe('use sqlite-sync synchronous', function () {
        const dbName = './__testdb_sync_.db';
        after(function () {
            fs.unlink(dbName, function(err){
                assert(err==null, err);
            });
        })
        it('test', function () {
            var ret = null;
            ret = db.exec_sync(dbName, 'aaa');
            assert('error' in ret, "error should occur");

            ret = db.exec_sync(dbName,"CREATE TABLE IF NOT EXISTS TBL_TEST (fn number, fs varchar2(255))");
            assert(ret instanceof Array, ret['error']);
            assert.equal(ret.length, 0, "ret should be []");
            assert(db.tblExists_sync(dbName, 'TBL_TEST'), "table should exist");
            ret = db.exec_sync(dbName,"CREATE TABLE IF NOT EXISTS TBL_TEST2 (fn number, fs varchar2(255))");
            assert(ret instanceof Array, ret['error']);
            assert.equal(ret.length, 0, "ret should be []");
            assert(db.tblExists_sync(dbName, 'TBL_TEST2'), "table should exist");
            assert(db.tblExists_sync(dbName, 'TBL_TEST3') == false, "table should not exist");
            ret = db.exec_sync(dbName,"INSERT INTO TBL_TEST (fn,fs) VALUES(100, 'sync100')");
            assert(typeof(ret) == 'number', ret['error']);
            ret = db.exec_sync(dbName,"INSERT INTO TBL_TEST (fn,fs) VALUES(101, 'sync101')");
            assert(typeof(ret) == 'number', ret['error']);
            ret = db.insert_sync(dbName, 'TBL_TEST', [{fn:'110',fs:'sync110'},{fn:'111',fs:'sync111'}]);
            assert(ret instanceof Array, ret['error']);
            ret = db.exec_sync(dbName,"SELECT * FROM TBL_TEST");
            assert(ret instanceof Array, ret['error']);
            assert.equal(ret.length, 4, "insert count should be 4");
            ret = db.exec_sync(dbName,"UPDATE TBL_TEST SET fn=201,fs='sync201' WHERE fn=100");
            assert.equal(ret, 0, ret['error']);
            ret = db.exec_sync(dbName, "SELECT fn,fs FROM TBL_TEST WHERE fn=201");
            assert.equal(ret.length, 1, "should found changed item");
            assert.equal(ret[0]['fs'], 'sync201', 'should be sync201');
            ret = db.exec_sync(dbName,"UPDATE TBL_TEST SET fn=201,fs='sync201' WHERE fn=100");
            assert.equal(ret, 0, ret['error']);
            ret = db.exec_sync(dbName,"DELETE FROM TBL_TEST WHERE fn=101");
            assert.equal(ret, 0, ret['error']);
            ret = db.exec_sync(dbName,"DELETE FROM TBL_TEST WHERE fn=101");
            assert.equal(ret, 0, ret['error']);
        });
        it('execBatch_sync', function (done) {
            var ret = null;
            ret = db.insert_sync(dbName, 'TBL_TEST', [{fn:'1001',fs:'sync1001'},{fn:'1002',fs:'sync1002'}]);
            assert(ret instanceof Array, ret['error']);
            ret = db.execBatch_sync(dbName,[
                    "UPDATE TBL_TEST SET fs='synca00a' WHERE fn=1001",
                    "UPDATE TBL_TEST SET fs='synca00b' WHERE fn=1002",
            ]);
            assert(ret instanceof Array, ret['error']);
            assert.equal(ret.length, 2, "ret length should be 4");
            ret = db.exec_sync(dbName, "SELECT fs FROM TBL_TEST WHERE fn=1001");
            assert(ret instanceof Array, ret['error']);
            assert.equal(ret[0]['fs'], 'synca00a');
            ret = db.exec_sync(dbName, "SELECT fs FROM TBL_TEST WHERE fn=1002");
            assert(ret instanceof Array, ret['error']);
            assert.equal(ret[0]['fs'], 'synca00b');
            done();
        })

    })
});
