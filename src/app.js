// modules
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

// .env
if (process.env.NODE_ENV !== "production") require("dotenv").config();

//database connection
const mongoConnect = require("./configs/db");
mongoConnect();

// express config
const app = express();
app.set("views", path.join("views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join("public")));
app.use(methodOverride("_method"));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			ttl: 7 * 24 * 60 * 60,
		}),
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//passport config
require("./configs/passport");

//middleware
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.errorMsg = req.flash("error");
	res.locals.successMsg = req.flash("success");
	res.locals.dateFormat = (date) => {
		return dayjs().to(dayjs(date));
	};
	res.locals.smallDate = (date) => {
		return dayjs(new Date()).format("MMM DD, YYYY");
	};
	res.locals.capitalize = (str) => {
		if (typeof str !== "string") return "";
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	next();
});

// routes config
app.use(require("./routes/home"));
app.use(require("./routes/auth"));
app.use(require("./routes/camps"));
app.use(require("./routes/comments"));
app.use(require("./routes/likes"));
app.use(require("./routes/profile"));

app.get("*", (req, res) => {
	res.render("404", { pageTitle: "404", error: "Page not found." });
});

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
