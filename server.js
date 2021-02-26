const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));


app.get("/images", (req, res) => {
    db.getImages().then(({rows}) => {
        console.log("response:", rows);
        res.json(rows);
    }).catch((err) => console.log("error in db.getImages sad puppy 🐶", err));
    console.log("hit the get route!");
});

app.listen(8080, () => console.log("My queen, you're going great and you got this 💪"));
