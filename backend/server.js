//imports
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");


//express setup
const app = express();
const port = process.env.PORT||3000;

app.use(cors());
app.use(express.json());


//database setup
const db = new sqlite3.Database("database.db");
//table creation
 db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE, 
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            score INTEGER
        )
    `);

    db.run (`
        CREATE TABLE IF NOT EXISTS saved_games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        board TEXT,
        score INTEGER
        )
    `);
 });


//API POST score
app.post("/score", (req, res) => {
    const {username, score} = req.body;
    if (!username || score === undefined) {
        return res.status(400).json({message: "username and score are required"});
    }

    db.run(
        "INSERT INTO scores (username, score) VALUES (?, ?)",
        [username, score],
        function(err) {

            if (err) {
                return res.status(500).json({error: err.message });
            }

            res.status(201).json({message: "Score saved!"});
        }
    );
});


//API GET leaderboard
app.get("/leaderboard", (req, res) => {
    db.all("SELECT username, MAX(score) as score FROM scores GROUP BY username ORDER BY score DESC LIMIT 10",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({error: err.message});
            }

            res.json(rows);
        }
    );
});


//API POST register
app.post("/register", (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    //const hashedPassword = await bycrypt.hash(password, 10);
    bcrypt.hash(password, 10).then(hashedPassword => {
        db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword],
            function(err) {

                if (err) {
                    if(err.message.includes("UNIQUE")){
                        return res.status(400).json({message: "Username already exists"});
                    }
                    return res.status(500).json({error: err.message});
                }
                res.status(201).json({message: "User registered successfully"});
            }
        );
    })
    .catch(err => {
        res.status(500).json({error: err.message});
    });
});



//API POST login
app.post("/login", (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) return res.status(500).json({error: err.message});
        if (!user) return res.status(400).json({message: "User not found"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({message: "Invalid password"});

        res.json({ message: "Login succesful"});
    });
});

//API POST saveGame
app.post("/saveGame", (req, res) => {
    const {username, board, score} = req.body;

    db.run(
        "INSERT INTO saved_games (username, board, score) VALUES (?, ?, ?)",
        [username, board, score],
        function(err) {
            if(err) return res.status(500).json({error: err.message });
            res.status(201).json({message: "Game saved!"});
        }
    );

});
//API GET loadGame
app.get("/load/:username", (req, res) => {
    const username = req.params.username;
    db.all("SELECT * FROM saved_games WHERE username = ? ORDER BY id DESC LIMIT 1",
        [username],
        (err, rows) => {
            if(err) return res.status(500).json({error: err.message});
            res.json(rows[0] || null);
        }
    );

});

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});

