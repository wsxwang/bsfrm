var assert = require('assert');

var userMgr= require('../src/api/user_mgr')

var testUserObj=[
    {obj:{guid:"__test001",name:"n1",pwd:"p1"}, valid:true},
    {obj:{guid:"__test001",name:"n11",pwd:""}, valid:true},
    {obj:{guid:"__test002",name:"n2"}, valid:true},
    {obj:{guid:"",name:"n1",pwd:"p1"}, valid:false},
    {obj:{guid:"__test001",name:"",pwd:"p1"}, valid:false},
    {obj:{name:"n1",pwd:"p1"}, valid:false},
    {obj:{guid:"__test001",pwd:"p1"}, valid:false},
    {obj:{pwd:"p1"}, valid:false},
    {valid:false},
]

describe('userMgr', function () {
    describe('isValidUser()', function () {
        it.skip('user obj valid test', function () {
            for (var i in testUserObj) {
                assert(userMgr.isValidUser(testUserObj[i]['obj']) == testUserObj[i]['valid']);
            }
        });
    });

    describe('addUser()', function () {
        it.skip('ignore invalid or guid repeated item', function () {
            var count = userMgr.allUsers().length;
            for (var i in testUserObj) {
                userMgr.addUser(testUserObj[i]['obj']);
            }
            assert(userMgr.allUsers().length, count +2);
            var found = userMgr.userByID("__test001");
            assert(found != null, "__test001 should exists");
            assert.deepEqual(found['name'], 'n1');
            assert.deepEqual(found['pwd'], 'p1');
            found = userMgr.userByID("__test002");
            assert(found != null, "__test002 should exists");
            assert.deepEqual(found['name'], 'n2');
            assert.deepEqual(found['pwd'], null);
        });
        it('change parameter should not change data', function () {
            var newUser = {guid:"__test100",name:"100"};
            userMgr.addUser(newUser);
            newUser['pwd'] = 'aaa';
            var found = userMgr.userByID('__test100');
            assert.deepEqual(found['pwd'], null);
        })
    });

    describe('modifyUser()', function () {
        it('modify item does not exist', function () {
            var count = userMgr.allUsers().length;
            var newUser = {guid:"__test200",name:"200"};
            userMgr.modifyUser(newUser);
            assert.deepEqual(userMgr.allUsers().length, count+1);
            var found = userMgr.userByID('__test200');
            assert(found != null);
        });
        it('modify item exist', function () {
            var count = userMgr.allUsers().length;
            var newUser = {guid:"__test200",name:"200+1"};
            userMgr.modifyUser(newUser);
            assert.deepEqual(userMgr.allUsers().length, count);
            var found = userMgr.userByID('__test200');
            assert.deepEqual(found['name'], "200+1");
        });
    });


    describe('delUser()', function () {
        it('delete unexist items should do nothing', function () {
            var count = userMgr.allUsers().length;
            userMgr.delUser('__testGone');
            assert.deepEqual(userMgr.allUsers().length, count);
        });
        it('get and delete all items', function () {
            var guids= [];
            for(var i in userMgr.allUsers()){
                guids.push(userMgr.allUsers()[i]['guid']);
            }
            for (var i in guids){
                userMgr.delUser(guids[i]);
            }
            assert.deepEqual(userMgr.allUsers().length, 0);
        });
    });
});
