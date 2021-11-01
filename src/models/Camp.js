const mongoose = require("mongoose");
const path = require("path");

const campSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		campImage: {
			url: String,
			cloudinary_id: String,
		},
		location: String,
		price: String,
		description: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			default: "public",
			enum: ["public", "private"],
		},
		likes: {
			type: Number,
			default: 0,
			min: 0,
		},
		likedUsers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Camp", campSchema);
