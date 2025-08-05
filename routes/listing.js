const express = require("express");
const router = express.Router();
const Wrapasync = require("../utils/Wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn,isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//Index route

router.route("/")
    .get(Wrapasync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),Wrapasync(listingController.createListing));


router.get("/new",isLoggedIn,Wrapasync(listingController.renderNewForm));

//Show route

router.route("/:id")
    .get(Wrapasync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),Wrapasync(listingController.UpdateListing))
    .delete(isLoggedIn,isOwner,Wrapasync(listingController.destroyListing))


router.get("/:id/edit",isLoggedIn,isOwner,Wrapasync(listingController.renderEditForm));

module.exports = router;
