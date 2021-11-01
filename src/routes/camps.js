const router = require("express").Router();
const path = require("path");
const fs = require("fs-extra");
const Fuse = require("fuse.js");

const Camp = require("../models/Camp");
const User = require("../models/User");
const { userInfo } = require("os");

//middleware
const { isLoggedIn, isCampOwner } = require("../configs/middleware");

// configs
const upload = require("../configs/multer");
const cloudinary = require("../configs/cloudinary");

// routes
router.get("/camps", async (req, res) => {
	try {
		const camps = await Camp.find({ status: "public" }).populate("creator");

		const fuse = new Fuse(camps, {
			includeScore: true,
			useExtendedSearch: true,
			keys: ["name", "location"],
		});

		let filtered = camps;

		if (req.query.q) {
			let data = fuse.search(req.query.q);
			filtered = data.map((e) => e.item);
		}

		res.render("camps/index", {
			pageTitle: "Camps",
			camps: filtered,
			searchOptions: req.query,
			path: req.path,
		});
	} catch (error) {
		console.log(error);
		res.redirect("/");
	}
});

router.post("/camps", upload.single("campImg"), isLoggedIn, async (req, res) => {
	try {
		const img = await cloudinary.uploader.upload(req.file.path, {
			public_id: `campedia/${req.user.username}/${req.file.filename}`,
			eager: [{ width: 300, height: 200, fetch_format: "auto" }],
		});

		const camp = new Camp({
			name: req.body.name,
			location: req.body.location,
			price: req.body.price,
			campImage: {
				url: img.eager[0].secure_url,
				cloudinary_id: img.public_id,
			},
			description: req.body.description,
			creator: req.user._id,
		});

		await camp.save();

		// save books Id in user model
		const user = await User.findById(req.user._id);
		user.posts.push(camp);

		await user.save();

		await fs.remove(req.file.path);

		// redirect
		req.flash("success", "Post created.");

		res.redirect("/camps");
	} catch (error) {
		res.redirect("/camps");
		console.log(error);
	}
});

router.get("/camps/new", isLoggedIn, (req, res) => {
	res.render("camps/new", { pageTitle: "Add Camp", path: req.path });
});

// show single camp + shows all comments + show comment form
router.get("/camps/:id", async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id).populate("comments").exec();
		res.render("camps/show", { pageTitle: camp.name, camp });
	} catch (error) {
		res.redirect("/camps");
		console.log(error);
	}
});

router.get("/camps/:id/edit", isCampOwner, async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		res.render("camps/edit", { pageTitle: "Edit camp", camp });
	} catch (error) {
		res.redirect(`/camps/${req.params.id}`);
		console.log(error);
	}
});

router.put("/camps/:id", isCampOwner, upload.single("campImg"), async (req, res) => {
	try {
		// find camp by id
		const camp = await Camp.findById(req.params.id);
		// delete the old image
		if (req.file) {
			// delete prev image
			await cloudinary.uploader.destroy(camp.campImage.cloudinary_id);

			const img = await cloudinary.uploader.upload(req.file.path, {
				public_id: `campedia/${req.user.username}/${req.file.filename}`,
				eager: [{ width: 300, height: 200, fetch_format: "auto" }],
			});

			camp.campImage = {
				url: img.eager[0].secure_url,
				cloudinary_id: img.public_id,
			};

			await fs.remove(req.file.path);
		}

		// edit
		if (req.body.name) camp.name = req.body.name;
		if (req.body.description) camp.description = req.body.description;
		if (req.body.location) camp.location = req.body.location;
		if (req.body.price) camp.price = req.body.price;

		//save
		await camp.save();
		req.flash("success", "Post updated.");

		//redirect
		res.redirect(`/camps/${req.params.id}`);
	} catch (error) {
		res.redirect(`/camps/${req.params.id}`);
		console.log(error);
	}
});

router.delete("/camps/:id", isCampOwner, async (req, res) => {
	try {
		const camp = await Camp.findById(req.params.id);
		const user = await User.findById(req.user.id);

		await cloudinary.uploader.destroy(camp.campImage.cloudinary_id);

		// remove posts id from user
		user.posts = user.posts.filter((e) => !e.equals(req.params.id));

		await user.save();
		req.flash("success", "Post deleted.");

		//remove
		await camp.remove();

		//redirect
		res.redirect("/camps");
	} catch (error) {
		res.redirect("/camps");
		console.log(error);
	}
});

module.exports = router;
