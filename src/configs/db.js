const mongoose = require("mongoose");

const mongoConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("database connected!!");
	} catch (error) {
		console.log(error);
	}
};

module.exports = mongoConnect;
