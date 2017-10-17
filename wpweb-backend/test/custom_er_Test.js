var assert = require('assert');

var custom_entity= require('../src/api/custom_entity')

describe('custom_er', function () {
	describe('meta-data process', function(){
		custom_entity.metaReadAllFromStore(function(err, allEntity){
			console.log(err);
			console.log(allEntity);
		});
		/*
		var timestamp = new Date().getTime();
		var newEntity={ID:'testeid-'+timestamp.toString(), label:timestamp.toString()};
		var newFields=[
			{ID:'testfid-' + timestamp.toString() + '01', name:'field-' + timestamp.toString() + '-string', type:'string', constraint:'unique,required'},
			{ID:'testfid-' + timestamp.toString() + '01', name:'field-' + timestamp.toString() + '-string2', name:'string2', type:'string'},
			{ID:'testfid-' + timestamp.toString() + '02', name:'field-' + timestamp.toString() + '-number', type:'number'},
			{ID:'testfid-' + timestamp.toString() + '03', name:'field-' + timestamp.toString() + '-password', type:'password'},
			];
		it('meta-data read , test item should not exist',function(){
			custom_entity.metaReadOneFromStore(newEntity.ID, function(err, foundItem){
				assert.deepEqual(err, null);
				assert.deepEqual(foundItem, null);
			});
		});
		it('metaUpdateToStore ==> add new', function(){
			custom_entity.metaUpdateToStore(newEntity, function(err){
				assert.deepEqual(err, null);
				custom_entity.metaReadOneFromStore(newEntity.ID, function(err, foundItem){
					assert.deepEqual(err, null);
					assert.deepEqual(foundItem['ID'], newEntity['ID']);
					assert.deepEqual(foundItem['label'], newEntity['label']);
				});
			});
		});
		it('metaUpdateToStore: label and fields', function(){
			newEntity['label'] = 'changed label';
			newEntity['fields'] = newFields;
			custom_entity.metaUpdateToStore(newEntity, function(err){
				assert.deepEqual(err, null);
				custom_entity.metaReadOneFromStore(newEntity.ID, function(err, foundItem){
					assert.deepEqual(err, null);
					assert.deepEqual(foundItem['ID'], newEntity['ID']);
					assert.deepEqual(foundItem['label'], 'changed label');
					assert.deepEqual(foundItem['fields'].length, newFields.length);
					for(var i in newFields){
						for(var j in newFields[i]){
							assert.deepEqual(foundItem['fields'][i][j], newFields[i][j]);
						}
					}
				});
			});
		});
		it('metaDelFromStore', function(){
			custom_entity.metaDelFromStore(newEntity['ID'], function(err){
				assert.deepEqual(err, null);
				custom_entity.metaReadOneFromStore(newEntity.ID, function(err, foundItem){
					assert.deepEqual(foundItem, null);
				});
			});
		});
		
		*/
	});
});
