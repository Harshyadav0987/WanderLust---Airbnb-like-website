const express = require("express");
const router = express.Router({ mergeParams: true });
const Wrapasync = require("../utils/Wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../models/listing.js");
const { isLoggedIn ,isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");
const { destroyListing } = require("../controllers/listing.js");

//reviews route

router.post("/", isLoggedIn,reviewController.createReview );

//Delete reviews route

router.delete("/:reviewId", isLoggedIn,isReviewAuthor,reviewController.destroyReview);

module.exports = router;
