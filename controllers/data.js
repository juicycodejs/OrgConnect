const itemModel = require("../models/item")
const contactModel = require("../models/contact")

async function insertItem(req, res){
    const {productname, category, quantity, price} = req.body;

    const newItem = new itemModel({productname, category, quantity, price})
    await newItem.save();

    res.redirect("/seller");

}

async function getSummaryData() {
    const items = await itemModel.find();
    const count = await itemModel.countDocuments();

    const [quantityAgg] = await itemModel.aggregate([
        { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
    ]);

    const [priceAgg] = await itemModel.aggregate([
        { $group: { _id: null, totalPrice: { $sum: { $multiply: ["$price", "$quantity"] } } } }
    ]);

    return {
        items,
        count,
        totalQuantity: quantityAgg ? quantityAgg.totalQuantity : 0,
        totalPrice: priceAgg ? priceAgg.totalPrice : 0
    };
}


async function displayItems(req, res) {
    const data = await getSummaryData();
    res.render("seller", data);
}

async function displayItemsBuyer(req, res) {
    const data = await getSummaryData();
    res.render("buyer", data);
}


async function deleteItem(req, res){
    try {
        await itemModel.findByIdAndDelete(req.params.id);
        res.redirect('/seller');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}


async function buyItem(req, res){
    const itemId = req.params.id;
    const buyQuantity = parseInt(req.body.buyQuantity);

    const item = await itemModel.findById(itemId);

    if (!item || item.quantity < buyQuantity) {
        return res.status(400).send('Insufficient quantity');
    }

    item.quantity -= buyQuantity;

    if (item.quantity === 0)
      await itemModel.findByIdAndDelete(itemId);
    else
      await item.save();

    res.redirect('/buyer');
}


async function insertContact(req, res){
    const {name, email, subject, message} = req.body;

    const newContact = new contactModel({name, email, subject, message})
    await newContact.save();

    res.redirect("/contact");

}


module.exports = {
    insertItem,
    displayItems,
    deleteItem,
    displayItemsBuyer,
    buyItem,
    insertContact,
}