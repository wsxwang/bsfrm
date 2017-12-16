CREATE TABLE IF NOT EXISTS TBL_DATA_user (guid varchar2(255), name varchar2(255), pwd varchar2(255));
CREATE TABLE IF NOT EXISTS TBL_relation (id1 varchar2(255), ename1 varchar2(255), id2 varchar2(255), ename2 varchar2(255), label varchar2(255));
insert into TBL_DATA_user (guid, name, pwd) values('00000000-0000-4000-y000-000000000000', 'admin', 'admin');

