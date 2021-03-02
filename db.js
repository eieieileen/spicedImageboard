const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY created_at DESC`;
    return db.query(q);
};

module.exports.addImage = (title, description, username, fullUrl) => {
    const q = `INSERT INTO images (title, description, username, url)
    VALUES ($1, $2, $3, $4)
    RETURNING id`;
    const params = [title, description, username, fullUrl];
    return db.query(q, params);
};

module.exports.infoImage = (id) => {
    const q = `SELECT * FROM images WHERE id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.insertComment = (imageId, username, commenttext)  => {
    const q = `INSERT INTO comments (imageId, username, commenttext)`;
    const params = [imageId, username, commenttext];
    return db.query(q, params);
};

module.exports.getComment = (id) => {
    const q = `SELECT * FROM comments WHERE id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

