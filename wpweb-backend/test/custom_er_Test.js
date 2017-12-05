var assert = require('assert');
var dbOpr = require('../src/cmp/dbOpr_sqlite');
var api= require('../src/api/custom_entity');
var data_api = require('../src/api/custom_entity_data');

describe('custom_er', function () {
	describe('entity and fields define test', function(){
		var timeStamp = new Date();
		var newEntity1={name:timeStamp.getTime().toString()+'_01', label:'test01', title:'mocha test entity 01', fields:[
			{eName:timeStamp.getTime().toString()+'_01', name:'f1', label:'column1', type:'varchar2(255)', title:'mocha test entity field 1'},
		]};
		var newEntity2={name:timeStamp.getTime().toString()+'_02', label:'test02', title:'mocha test entity 02', fields:[
			{eName:timeStamp.getTime().toString()+'_02', name:'f1', label:'column1', type:'varchar2(255)', title:'mocha test entity field 1'},
			{eName:timeStamp.getTime().toString()+'_02', name:'f2', label:'column2', type:'number', title:'mocha test entity field 2'},
		]};
		
		after(function(done){
			console.log('you may need to delete entity manually:%s,%s', newEntity1['name'], newEntity2['name']);
			done();
		});
		
		it('checkEntityFmt()', function(done){
			assert(api.checkEntityFmt({name:'n',label:'l',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == true, "should true");
			assert(api.checkEntityFmt({name:'n',label:'l',title:'t',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)',title:'t'}]}) == true, "should true2");
			assert(api.checkEntityFmt({name:'names',label:'l',title:'t',fields:[{eName:'names', name:'f',label:'l',type:'varchar2(255)',title:'t'}]}) == false, "can not use names as entity name!");
			assert(api.checkEntityFmt() == false, "null, should false");
			assert(api.checkEntityFmt({}) == false, "empty, should false");
			assert(api.checkEntityFmt({label:'l',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == false, "name null, should false");
			assert(api.checkEntityFmt({name:'',label:'l',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == false, "name empty, should false");
			assert(api.checkEntityFmt({name:'aa-aa',label:'l',fields:[{name:'f',label:'l',type:'varchar2(255)'}]}) == false, "name contains -, should false");
			assert(api.checkEntityFmt({name:'n',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == false, "label null, should false");
			assert(api.checkEntityFmt({name:'n',label:'',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == false, "label empty, should false");
			assert(api.checkEntityFmt({name:'n',label:'l',}) == false, "fields null, should false");
			assert(api.checkEntityFmt({name:'n',label:'l',fields:[]}) == false, "fields empty, should false");
			assert(api.checkEntityFmt({name:'n',label:'l',fields:''}) == false, "fields not array, should false");
			assert(api.checkEntityFmt({name:'n',label:'l',fields:[{eName:'', name:'f',label:'l',type:'varchar2(255)'}]}) == true, "filed eName empty, should true");
			assert(api.checkEntityFmt({name:'n',label:'l',fields:[{name:'f',label:'l',type:'varchar2(255)'}]}) == true, "filed eName null, should true");
			assert(api.checkEntityFmt({name:'n',label:'l',fields:[{eName:'a', name:'f',label:'l',type:'varchar2(255)'}]}) == false, "filed eName not match, should false");
			done();
		});
		it('checkFieldFmt()', function(done){		
			assert(api.checkFieldFmt({eName:'e', name:'f',label:'l',type:'varchar2(255)'}) == true, "should true");
			assert(api.checkFieldFmt({eName:'e', name:'f',label:'l',type:'varchar2(255)',title:'t'}) == true, "should true2");
			assert(api.checkFieldFmt() == false, "null, should false");
			assert(api.checkFieldFmt({}) == false, "empty, should false");
			assert(api.checkFieldFmt({eName:'e',label:'l',type:'varchar2(255)'}) == false, "name null, should false");
			assert(api.checkFieldFmt({eName:'e',name:'',label:'l',type:'varchar2(255)'}) == false, "name empty, should false");
			assert(api.checkFieldFmt({eName:'e',name:'f',type:'varchar2(255)'}) == false, "label null, should false");
			assert(api.checkFieldFmt({eName:'e',name:'f',label:'',type:'varchar2(255)'}) == false, "label empty, should false");
			assert(api.checkFieldFmt({eName:'e',name:'f',label:'l'}) == false, "type null, should false");
			assert(api.checkFieldFmt({eName:'e',name:'f',label:'l',type:''}) == false, "type empty, should false");
			assert(api.checkFieldFmt({eName:'e',name:'f',label:'l',type:'date'}) == false, "type unspport, should false");
			done();
		});
		it('find entity test', function(done){
			try{
				var newName = newEntity1['name'];
				var names = api.allEntityName();
				assert.equal(names.findIndex(function(v){return v==newName;}), -1, "should not exist");
				var entitys = api.allCompleteEntityMetaData();
				assert.equal(names.length, entitys.length, 'should same length');
				for(var i in names){
					assert(entitys.findIndex(function(v){return v['name']== names[i];}) >= 0, "should found");
				}
				var entity = api.completeEntityMetaData(newName);
				assert.equal(entity, null, "should not found");
			}catch(err){
				assert(false, "should not throw," + err);
			}
			done();
		});
		it('insert entity test', function(done){
			try{
				api.updateEntitys([newEntity1, newEntity2]);
				var entity = api.completeEntityMetaData(newEntity1['name']);
				assert(entity != null, "should found " + newEntity1['name']);
				entity = api.completeEntityMetaData(newEntity2['name']);
				assert(entity != null, "should found " + newEntity2['name']);
				assert.equal(entity['name'], newEntity2['name'], "entity name should same");
				assert.equal(entity['label'], newEntity2['label'], "entity label should same");
				assert.equal(entity['title'], newEntity2['title'], "entity title should same");
				assert.equal(entity['fields'].length, newEntity2['fields'].length, 'should same length');
				for(var i in entity['fields']){
					var index = newEntity2['fields'].findIndex(function(v){return v['name']==entity['fields'][i]['name'];});
					assert(index >= 0, 'filed ' + entity['fields'][i]['name'] + ' should found');
					assert.equal(entity['fields'][i]['name'], newEntity2['fields'][index]['name'], 'field name should same');
					assert.equal(entity['fields'][i]['label'], newEntity2['fields'][index]['label'], 'field label should same');
					assert.equal(entity['fields'][i]['title'], newEntity2['fields'][index]['title'], 'field title should same');
					assert.equal(entity['fields'][i]['type'], newEntity2['fields'][index]['type'], 'field type should same');
				}
			}catch(err){
				assert(false, "should not throw," + err);
			}
			done();
		});
		it('update entity test', function(done){
			try{
				var changedEntity={name:newEntity2['name'], label:'changed ', title:'mocha test entity 02 changed', fields:[
					{eName:newEntity2['name'], name:'f1', label:'column1 changed', type:'varchar2(255)', title:'mocha test entity field 1 changed'},
					{eName:newEntity2['name'], name:'f2', label:'column2', type:'number', title:'mocha test entity field 2'},
					{eName:newEntity2['name'], name:'f3', label:'column3', type:'number', title:'mocha test entity field 3 added'},
				]};
				api.updateEntitys([changedEntity]);
				var entity = api.completeEntityMetaData(newEntity2['name']);
				assert(entity != null, "should found " + newEntity2['name']);
				assert.equal(entity['name'], newEntity2['name'], "entity name should same");
				assert.equal(entity['label'], changedEntity['label'], "entity label should same");
				assert.equal(entity['title'], changedEntity['title'], "entity title should same");
				assert.equal(entity['fields'].length, changedEntity['fields'].length, 'should same length');
				for(var i in entity['fields']){
					var index = changedEntity['fields'].findIndex(function(v){return v['name']==entity['fields'][i]['name'];});
					assert(index >= 0, 'filed ' + entity['fields'][i]['name'] + ' should found');
					assert.equal(entity['fields'][i]['name'], changedEntity['fields'][index]['name'], 'field name should same');
					assert.equal(entity['fields'][i]['label'], changedEntity['fields'][index]['label'], 'field label should same');
					assert.equal(entity['fields'][i]['title'], changedEntity['fields'][index]['title'], 'field title should same');
					assert.equal(entity['fields'][i]['type'], changedEntity['fields'][index]['type'], 'field type should same');
				}
			}catch(err){
				assert(false, "should not throw," + err);
			}
			done();
		});
		it('update entity fail test', function(done){
			try{
				var changedEntity={name:newEntity2['name'], label:newEntity2['label'], title:'mocha test entity 02 modify field type fail', fields:[
					{eName:newEntity2['name'], name:'f1', label:'column1', type:'number', title:'mocha test entity field 1 change type'},
					{eName:newEntity2['name'], name:'f2', label:'column2', type:'number', title:'mocha test entity field 2'},
					{eName:newEntity2['name'], name:'f3', label:'column3', type:'number', title:'mocha test entity field 3 added'},
				]};
				api.updateEntitys([changedEntity]);
				var entity = api.completeEntityMetaData(newEntity2['name']);
				assert(false, "should throw");
			}catch(err){
				assert(true, "should throw,"+err);
			}
			try{
				var changedEntity={name:newEntity2['name'], label:newEntity2['label'], title:'mocha test entity 02 delete field fail', fields:[
					{eName:newEntity2['name'], name:'f1', label:'column1', type:'varchar2(255)', title:'mocha test entity field 1'},
				]};
				api.updateEntitys([changedEntity]);
				var entity = api.completeEntityMetaData(newEntity2['name']);
				assert(false, "should throw");
			}catch(err){
				assert(true, "should throw,"+err);
			}
			done();
		});
		it('delete entity test', function(done){
			try{
				api.delEntitys(newEntity1['name']+","+newEntity2['name']);
				api.delEntitys(newEntity1['name']+","+newEntity2['name']);
			}catch(err){
				assert(false, "should not throw," + err);
			}
			done();
		});
	});
	
	describe('entity data access test', function(){
		var timeStamp = new Date();
		var entityName = timeStamp.getTime().toString()+'_access';
		var accessEntity={name:entityName, label:'test01', title:'mocha test entity data access', fields:[
			{name:'f1', label:'column1', type:'varchar2(255)', title:'mocha test entity access field 1'},
			{name:'f2', label:'column2', type:'number', title:'mocha test entity access field 2'},
		]};
		
		before(function(done){
			api.updateEntitys([accessEntity]);
			done();
		});
		after(function(done){
			api.delEntitys(entityName);
			console.log('you may need to delete entity manually:%s', entityName);
			done();
		});
		
		it('access undefined entity', function(done){
			try{
				data_api.allRecords(entityName);
				assert(false, "should throw: allRecords");
			}catch(err){
				assert(true);
			}
			try{
				data_api.recordByGuid(entityName, 'xxx');
				assert(false, "should throw: recordByGuid");
			}catch(err){
				assert(true);
			}
			try{
				data_api.delRecords(entityName, 'xx,xx');
				assert(false, "should throw: delRecords");
			}catch(err){
				assert(true);
			}
			try{
				data_api.updateRecords(entityName,[]);
				assert(false, "should throw: updateRecords");
			}catch(err){
				assert(true);
			}
			done();
		});
		
		it.skip('parameter error test', function(done){
		});
		
		it('find while empty', function(done){
			var ret = null;
			try{
				ret = data_api.allRecords(entityName);
				assert.equal(ret.length, 0, "should empty");
				
				ret = data_api.recordByGuid(entityName, 'xxx');
				assert.equal(ret, null, "should null");
			}catch(err){
				assert(false, 'should not throw ' + err);
			}
			done();
		});

		it('insert one -> find', function(done){
			var rec1 = {guid:'rec1', f1:'a', f2:1};
			try{
				data_api.updateRecords(entityName, [rec1]);
				var ret = data_api.allRecords(entityName);
				assert.equal(ret.length, 1, "should get one");
				var rec = null;
				rec = data_api.recordByGuid(entityName, ret[0]['guid']);
				assert(rec!=null, "should not null");

				assert.equal(ret[0]['guid'], rec['guid'], "guid should equal");
				assert.equal(ret[0]['f1'],rec['f1'], "f1 should equal");
				assert.equal(ret[0]['f2'],rec['f2'], "f2 should equal");
				assert.equal(rec['guid'],'rec1', "guid should 'rec1'");
				assert.equal(rec['f1'],'a', "f1 should 'a'");
				assert.equal(rec['f2'],1, "f2 should 2");
			}catch(err){
				assert(false, 'should not throw ' + err);
			}
			done();
		});
		
		it('update and insert', function(done){
			var rec1 = {guid:'rec1', f1:'aa', f2:11};
			var rec2 = {f1:'bb', f2:22};
			var rec3 = {guid:'rec3', f1:'bb', f2:22};
			try{
				data_api.updateRecords(entityName, [rec1, rec2, rec3]);
				var ret = data_api.allRecords(entityName);
				assert.equal(ret.length, 3, "should get 3 records");
				
				var index = ret.findIndex(function(v){return v['f1']=='aa';});
				assert(index!=-1, "rec1 f1 should change to aa");
				assert.equal(ret[index]['guid'], 'rec1', "rec1 guid should still rec1");
				assert.equal(ret[index]['f2'], 11, "rec1 f2 should change to 11");
				
				var index = ret.findIndex(function(v){return v['f1']=='bb';});
				assert(index!=-1, "new rec2 should exist");
				assert(ret[index]['guid']!=null, "rec2 guid should not null");
				assert.equal(ret[index]['f2'], 22, "rec2 f2 should be 22");
			}catch(err){
				assert(false, 'should not throw ' + err);
			}
			done();
		});
		it('delete', function(done){
			try{
				data_api.delRecords(entityName, 'rec1,rec3');
				var ret = data_api.allRecords(entityName);
				assert.equal(ret.length, 1, "should 1 left");
				
				ret = data_api.recordByGuid(entityName, 'rec1');
				assert.equal(ret, null, "rec1 should be deleted");
				ret = data_api.recordByGuid(entityName, 'rec3');
				assert.equal(ret, null, "rec3 should be deleted");
			}catch(err){
				assert(false, 'should not throw ' + err);
			}
			done();
		});
	});
	
});
