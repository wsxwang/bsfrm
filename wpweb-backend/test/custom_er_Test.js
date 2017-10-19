var assert = require('assert');
var dbOpr = require('../src/cmp/dbOpr_sqlite');
var custom_entity= require('../src/api/custom_entity');

describe('custom_er', function () {
	describe('meta-data entity and fields', function(){
		var timestamp = new Date().getTime();
		var newEntity={ID:'testeid-'+timestamp.toString(), name:timestamp.toString(), label:timestamp.toString()};
		var newFields=[
			{EID:newEntity['ID'], ID:'testfid-' + timestamp.toString() + '01', name:'field-' + timestamp.toString() + '-string', type:'string', constraints:'unique,required'},
			{EID:newEntity['ID'], ID:'testfid-' + timestamp.toString() + '01', name:'field-' + timestamp.toString() + '-string2', label:'string2', type:'string'},
			{EID:newEntity['ID'], ID:'testfid-' + timestamp.toString() + '02', name:'field-' + timestamp.toString() + '-number', type:'number'},
			{EID:newEntity['ID'], ID:'testfid-' + timestamp.toString() + '03', name:'field-' + timestamp.toString() + '-password', type:'password'},
			];

		after(function (done) {
            var ret = dbOpr.execBatch_sync('public/db/TBL_meta_data.db', [
                "DELETE FROM TBL_meta_EntityDefine WHERE ID LIKE 'testeid-%'",
                "DELETE FROM TBL_meta_EntityFieldDefine WHERE EID LIKE 'testeid-%' AND ID LIKE 'testfid-%'",
            ]);
            assert(ret.length == 2, ret['error']);
            done();
        });

		it('meta-data, find all',function (done) {
			try {
                var ret = custom_entity.allEntity();
                for (var i in ret) {
                    assert(ret[i]['ID'] != newEntity['ID'], "test entity should not exist");
                }
                ret = custom_entity.allFields();
                for (var i in ret) {
                    assert(ret[i]['ID'] != newFields[0]['ID'], "test fields should not exist");
                }
            }catch(e){
                console.log(e);
				assert(e == null, "should not throw");
			}
			done();
        });

        it('meta-data, new entity and find', function (done) {
            try{
                var ret = custom_entity.insertEntitys([newEntity]);
                ret = custom_entity.entityByID(newEntity['ID']);
                assert(ret != null, "should insert one");
                assert.deepEqual(ret, newEntity, "should same");
            }catch (e){
            	console.log(e);
                assert(e == null, "should not throw");
            }
            done();
        });

        it('meta-data, new fields and find', function (done) {
            try{
                var ret = custom_entity.insertFields(newFields)
                ret = custom_entity.fieldsByEID(newEntity['ID']);
                assert(ret != null, "should insert ok");
                assert.equal(ret.length, 4, "should insert 4");
                for(var i = 0; i < 4; i ++){
                	for(var j in newFields[i]) {
                        assert.deepEqual(ret[i][j], newFields[i][j], j + "should same");
                    }
				}
            }catch (e){
                console.log(e);
                assert(e == null, "should not throw");
            }
            done();
        });

        it('meta-data, update entity', function (done) {
			try{
				var nonItem = {ID:'testeid-'+(new Date().getTime().toString()), name:'name2', label:'changed2'};
				var ret = custom_entity.updateEntitys([
                    {ID:newEntity['ID'], name:'name1', label:'changed1'},
					nonItem,
				]);
				ret = custom_entity.entityByID(newEntity['ID']);
				assert(ret != null, "should exist");
                assert.equal(ret['label'], 'changed1', ret['label']);
                ret = custom_entity.entityByID(nonItem['ID']);
                assert(ret == null, "should not exist");
            }catch (e){
                console.log(e);
                assert(e == null, "should not throw");
            }
            done();
        })

        it('meta-data, update fields', function (done) {
            try{
                var nonItem = {EID:newEntity['ID'], ID:'testfid-'+(new Date().getTime().toString()), name:'field-' + timestamp.toString() + '-string', type:'string', constraints:'unique,required'};
                var ret = custom_entity.updateFields([
                    {EID:newEntity['ID'], ID:'testfid-' + timestamp.toString() + '03', name:'field-' + timestamp.toString() + '-password', label:'changed label', type:'password'},
                    nonItem,
                ]);
                ret = custom_entity.fieldByID('testfid-' + timestamp.toString() + '03');
                assert(ret != null, "should exist");
                assert.equal(ret['label'], 'changed label', ret['label']);
                ret = custom_entity.fieldByID(nonItem['ID']);
                assert(ret == null, "should not exist");
            }catch (e){
                console.log(e);
                assert(e == null, "should not throw");
            }
            done();
        })

        it('meta-data, delete entity', function (done) {
            try{
                var ret = custom_entity.delEntity(newEntity['ID']);
                ret = custom_entity.entityByID(newEntity['ID']);
                assert(ret == null, "should not exist");
            }catch (e){
                console.log(e);
                assert(e == null, "should not throw");
            }
            done();
        })
        it('meta-data, delete fields', function (done) {
            try{
                var ret = custom_entity.delField(newFields[0]['ID']);
                ret = custom_entity.fieldByID(newFields[0]['ID']);
                assert(ret == null, "should not exist");
                var ret = custom_entity.delFieldsByEID(newEntity['ID']);
                ret = custom_entity.fieldsByEID(newEntity['ID']);
                assert.equal(ret.length, 0, "should not exist");
            }catch (e){
                console.log(e);
                assert(e == null, "should not throw");
            }
            done();
        })
	});
});
