const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	content: {
		type: String,
		trim: true,
	},
	author: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Comment", commentSchema);
