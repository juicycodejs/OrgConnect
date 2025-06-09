const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    productname:{ type: String, required: true },
    category:{ type: String, required: true },
    quantity:{ type: Number, required: true, min:0 },
    price:{ type: Number, required: true },
})

const item = mongoose.model("items", itemSchema);

module.exports = item;