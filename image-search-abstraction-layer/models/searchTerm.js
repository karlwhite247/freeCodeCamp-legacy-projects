const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// model
const searchTermSchema = new Schema({
	searchVal: String,
	searchDate: Date
}, {timestamps: true});

// coonnect model and collection
const ModelClass = mongoose.model('searchTerm', searchTermSchema);

module.exports = ModelClass;