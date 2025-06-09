const express = require("express");
const {createUser, signin} = require("../controllers/user");
const { insertItem, displayItems, displayItemsBuyer, deleteItem, buyItem, insertContact} = require("../controllers/data");

const router = express.Router();


router.get("/", (req, res) => {
    res.render("index")
})
router.get("/signup", (req, res) => {
    res.render("signup")
})
router.get("/login", (req, res) => {
    res.render("login")
})
router.get("/contact", (req, res) => {
    res.render("contact")
})

router.get("/buyer", displayItemsBuyer);
router.get("/seller", displayItems);


router.post('/signup', createUser);
router.post('/login', signin);
router.post('/seller', insertItem);
router.post('/delete/:id', deleteItem);
router.post('/buy/:id', buyItem);
router.post('/contact', insertContact);

module.exports = router
