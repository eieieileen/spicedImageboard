const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");

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
app.use(express.json());

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            // console.log("response:", rows);
            res.json(rows);
        })
        .catch((err) => console.log("error in db.getImages sad puppy 🐶", err));
    console.log("hit the get route!");
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { title, username, description, selected } = req.body;
    const { filename } = req.file;

    const imgToAws = {
        url: "https://s3.amazonaws.com/eileensimageboard/" + filename,
        username: username,
        title: title,
        description: description,
        selected: selected,
    };

    if (req.file) {
        //console.log("req.file", req.file);
        db.addImage(
            title,
            description,
            username,
            "https://s3.amazonaws.com/eileensimageboard/" + filename,
            selected
        )
            .then(({ rows }) => {
                imgToAws.id = rows[0].id;
                res.json({
                    //success: true,
                    imgToAws: imgToAws,
                });
            })
            .catch((err) => console.log("err in ab.addImage🦆", err));
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/info/:id", (req, res) => {
    const { id } = req.params;
    db.infoImage(id)
        .then(({ rows }) => {
            // console.log("response van db.infoImage", rows);
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error in db.infoImage ✂️", err);
            res.json();
        });
});

app.get("/get-comments/:id", (req, res) => {
    const { id } = req.params;
    console.log("is this the id", req.params);
    db.getComment(id).then(({ rows }) => {
        // console.log("response van getcomments", rows);
        res.json(rows);
    });
});

app.post("/commentToDb", (req, res) => {
    const { imgId, username, comment } = req.body;
    db.insertComment(imgId, username, comment)
        .then(({ rows }) => {
            console.log("response van commenttodb", rows);
            res.json(rows[0]);
        })
        .catch((err) => console.log("error in commentToDb 🥑", err));
});

app.get("/getNextImg/:id", (req, res) => {
    const { id } = req.params;
    db.getNext(id).then(({rows}) => {
        console.log("response van getNext", rows);
        res.json(rows);
    }).catch((err) => {
        console.log("error in getNext", err);
    });
});


app.listen(8080, () =>
    console.log("My queen, you're going great and you've got this 💪")
);
