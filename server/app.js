const express = require("express");
const bodyParser = require("body-parser");
const maria = require("./DB/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

const path = require("path");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const SECRET_KEY = "MY-SECRET-KEY";

app.post("/api/test1", (req, res) => {
    let pw = "1234red!";
    maria.query("select * from Users where id=?", ["s207040@gmail.com"], (err, rows, fields) => {
        if(err) return res.json({error: err});
        if(rows.length === 0) return res.json({error: err});
        else{
            const resultUser = bcrypt.compare(pw, rows[0].password);
            if(resultUser){
                const token = jwt.sign(
                  {
                    type: "JWT",
                    id: rows[0].id,
                    isAdmin: rows[0].idx,
                  },
                  SECRET_KEY,
                  { expiresIn: "10m", issuer: "token" }
                );
                maria.query(
                  "UPDATE users SET token=? where id=?",
                  [token, rows[0].id],
                  async (err, dds, fields) => {
                    maria.query(
                      "SELECT * FROM Users WHERE id = ? ",
                      rows[0].id,
                      async function (err, rows, fields) {
                        res.json({
                          code: 200,
                          message: "Token Success",
                          UserInfo: rows[0],
                        });
                      }
                    );
                  }
                );
            }
        }
    })
});

app.post("/api/test2", (req, res) => {
    console.log(req.body.user)
    maria.query("insert into users (id) values (?)", [req.body.user], (err, rows, fields) => {
        res.json({test: err});
    })
});

app.post("/api/test3", (req, res) => {
    let pw = bcrypt.hashSync("1234red!", 10);
    maria.query("update users set password=? where idx=1", [pw], (err, rows, fields) => {
        res.json({test: err});
    })
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
