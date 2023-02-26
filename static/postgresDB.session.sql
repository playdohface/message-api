create table if not EXISTS testtable (
    awesome_field text,
    id serial primary key
);

insert into testtable values ('awesome');


insert into testtable VALUES ('another one');
select * from testtable;