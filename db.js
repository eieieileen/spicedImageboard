const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY created_at DESC 
    LIMIT 6`;
    return db.query(q);
};

module.exports.addImage = (title, description, username, fullUrl, selected) => {
    const q = `INSERT INTO images (title, description, username, url, selected)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;
    const params = [title, description, username, fullUrl, selected];
    return db.query(q, params);
};

module.exports.infoImage = (id) => {
    const q = `SELECT * FROM images WHERE id = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.insertComment = (imageId, username, commenttext)  => {
    const q = `INSERT INTO comments (imageId, username, commenttext)
    VALUES ($1, $2, $3)
    RETURNING *`;
    const params = [imageId, username, commenttext];
    return db.query(q, params);
};

module.exports.getComment = (id) => {
    const q = `SELECT * FROM comments WHERE imageId = ($1)`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getNext = (id) => {
    const q = `  SELECT url, title, id, (
      SELECT id FROM images
      ORDER BY id ASC
      LIMIT 1
    ) AS "lowestId" FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 6;
    `;
    const params = [id];
    return db.query(q, params);
};
