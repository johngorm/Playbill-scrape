const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},

	link: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	saved: {
		type: Boolean,
		default: false
	},
	comment: {
		type: [Schema.Types.ObjectId],
		ref: 'Comment'
	}
});

let Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;