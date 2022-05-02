if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")

const app = express();
app.use(express.json())
app.use(cors({
    credentials: true
}))
app.use(cookieParser())

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/frontend/build')));
}

const secret = process.env.SECRET

app.use(session({
    key: "session",
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000
    }
}))

require('./routes/restaurants.js')(app);
require('./routes/reviews.js')(app);
require('./routes/users.js')(app);

const port = process.env.PORT || 3001;

const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})