require('dotenv').config();

const express = require("express");
const path = require("path");
const router  = require("./routes/url");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

app = express();

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB connected")).catch(err => console.log("MongoDB Error", err))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/", router);


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
});