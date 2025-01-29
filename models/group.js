const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true},
    about: { type: String, require: true},
    twitter: { type: String, require: true},
    telegram: { type: String, require: true},
    casas: { type: String, require: true},
    tipo: { type: String, require: true},
    products: { type: String, require: true},
    images: [String]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
