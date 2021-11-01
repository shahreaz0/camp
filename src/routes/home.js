const router = require("express").Router();

const Camp = require("../models/Camp");

router.get("/", async (req, res) => {
	try {
		const recentCamps = await Camp.find()
			.populate("creator")
			.sort({ createdAt: "desc" })
			.limit(10);

		res.render("home", {
			title: "Campedia",
			camps: recentCamps,
			path: req.path,
		});
	} catch (error) {
		console.log(error);
		// res.render("404", {
		// 	pageTitle: "404",
		// });
	}
});

module.exports = router;
