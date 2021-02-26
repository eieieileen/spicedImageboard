const express = require("express");
const app = express();
const db = require("./db");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});


app.use(express.static("public"));


app.get("/images", (req, res) => {
    db.getImages().then(({rows}) => {
        console.log("response:", rows);
        res.json(rows);
    }).catch((err) => console.log("error in db.getImages sad puppy 🐶", err));
    console.log("hit the get route!");
});

app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("hit the post route...");
    console.log("req.file: ", req.file);
    console.log("req.body: ", req.body);
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, () => console.log("My queen, you're going great and you got this 💪"));
