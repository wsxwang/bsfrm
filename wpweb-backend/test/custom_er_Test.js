var assert = require('assert');
var dbOpr = require('../src/cmp/dbOpr_sqlite');
var api= require('../src/api/custom_entity');

describe('custom_er', function () {
	describe('entity and fields define test', function(){
		var timeStamp = new Date();
		var newEntity1={name:timeStamp.getTime().toString()+'-01', label:'test01', title:'mocha test entity 01', fields:[
			{eName:timeStamp.getTime().toString()+'-01', name:'f1', label:'column1', type:'varchar2(255)', title:'mocha test entity field 1'},
		]};
		var newEntity2={name:timeStamp.getTime().toString()+'-02', label:'test02', title:'mocha test entity 02', fields:[
			{eName:timeStamp.getTime().toString()+'-01', name:'f1', label:'column1', type:'varchar2(255)', title:'mocha test entity field 1'},
			{eName:timeStamp.getTime().toString()+'-02', name:'f2', label:'column2', type:'number', title:'mocha test entity field 2'},
		]};
		
		after(function(done){
			console.log('you may need to delete entity manually:%s,%s', newEntity1['name'], newEntity2['name']);
			done();
		});
		
		it('checkEntityFmt()', function(done){
			assert(api.checkEntityFmt({name:'n',label:'l',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == true, "should true");
			assert(api.checkEntityFmt({name:'n',label:'l',title:'t',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)',title:'t'}]}) == true, "should true2");
			assert(api.checkEntityFmt() == false, "null, should false");
			assert(api.checkEntityFmt({}) == false, "empty, should false");
			assert(api.checkEntityFmt({label:'l',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == false, "name null, should false");
			assert(api.checkEntityFmt({name:'',label:'l',fields:[{eName:'n', name:'f',label:'l',type:'varchar2(255)'}]}) == false, "name empty, should false");
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
			}finally{
				done();
			}
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
					assert.equal(entity['fields'][i]['eName'], newEntity2['fields'][index]['eName'], 'field eName should same');
					assert.equal(entity['fields'][i]['name'], newEntity2['fields'][index]['name'], 'field name should same');
					assert.equal(entity['fields'][i]['label'], newEntity2['label'][index]['eName'], 'field label should same');
					assert.equal(entity['fields'][i]['title'], newEntity2['fields'][index]['title'], 'field title should same');
					assert.equal(entity['fields'][i]['type'], newEntity2['fields'][index]['type'], 'field type should same');
				}
			}catch(err){
				assert(false, "should not throw," + err);
			}finally{
				done();
			}
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
					assert.equal(entity['fields'][i]['eName'], changedEntity['fields'][index]['eName'], 'field eName should same');
					assert.equal(entity['fields'][i]['name'], changedEntity['fields'][index]['name'], 'field name should same');
					assert.equal(entity['fields'][i]['label'], changedEntity['label'][index]['eName'], 'field label should same');
					assert.equal(entity['fields'][i]['title'], changedEntity['fields'][index]['title'], 'field title should same');
					assert.equal(entity['fields'][i]['type'], changedEntity['fields'][index]['type'], 'field type should same');
				}
			}catch(err){
				assert(false, "should not throw," + err);
			}finally{
				done();
			}
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
			}finally{
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
			}finally{
				done();
			}
		});
		it('delete entity test', function(done){
			try{
				api.delEntitys([newEntity1['name'], newEntity2['name']]);
				api.delEntitys([newEntity1['name'], newEntity2['name']]);
			}catch(err){
				assert(false, "should not throw," + err);
			}finally{
				done();
			}
		});
	});
});
