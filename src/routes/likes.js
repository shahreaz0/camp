const router = require("express").Router();

// models
const Camp = require("../models/Camp");

// middleware
const { isLoggedIn } = require("../configs/middleware");

router.post("/camps/:id/like", isLoggedIn, async (req, res) => {
	const camp = await Camp.findById(req.params.id);

	if (!camp.likedUsers.includes(req.body.userid)) {
		camp.likedUsers.push(req.body.userid);
		camp.likes = camp.likes + 1;
	} else {
		camp.likedUsers = camp.likedUsers.filter(
			(e) => !e.equals(req.body.userid)
		);
		if (camp.likes > 0) camp.likes = camp.likes - 1;
	}

	await camp.save();
	res.send({ likes: camp.likes });
});

module.exports = router;
