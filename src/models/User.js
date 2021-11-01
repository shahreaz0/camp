const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		maxlength: 20,
	},
	password: {
		type: String,
		minlength: 6,
	},
	googleId: {
		type: String,
	},
	fullName: {
		type: String,
		maxlength: 50,
	},
	thumbnail: {
		type: String,
		default: "https://tinyurl.com/y6qo86km",
	},
	gender: {
		type: String,
	},
	age: {
		type: Number,
		min: 1,
	},
	email: {
		type: String,
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Camp",
		},
	],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
