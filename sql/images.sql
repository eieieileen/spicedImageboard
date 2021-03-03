DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    imageId VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    commenttext VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    selected VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description, selected) VALUES (
    'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
    'funkychicken',
    'Welcome to Spiced and the Future!',
    'This photo brings back so many great memories.',
    'n'
);

INSERT INTO images (url, username, title, description, selected) VALUES (
    'https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
    'discoduck',
    'Elvis',
    'We can''t go on together with suspicious minds.',
    'n'
);

INSERT INTO images (url, username, title, description, selected) VALUES (
    'https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
    'discoduck',
    'To be or not to be',
    'That is the question.',
    'n'
);

