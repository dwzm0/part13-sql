CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
insert into blogs (author, url, title) values ('Dima Alieksieve', 'https://random-url.com', 'Also Sprach Fafnir');
insert into blogs (author, url, title) values ('Matti Lecturer', 'https://fullstackopen.com', 'How to be cool');