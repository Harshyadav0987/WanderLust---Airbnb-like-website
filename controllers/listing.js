const Listing = require("../models/listing");

// index route 

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//Create route 

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new");
};

//show route

module.exports.showListing =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path: "reviews",populate : {path : "author",}}) 
      .populate("owner");
    res.render("listings/show.ejs", { listing ,currUser : req.user});
};

//create listing

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    res.redirect("/listings");
};

//Render edit Listing form

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let listingImage = listing.image.url;
    listingImage= listingImage.replace("/upload","/upload/h_250,w_250");
    res.render("listings/edit.ejs", { listing ,currUser : req.user,listingImage});
};

//Update Listing 

module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;
    // console.log(req.body.listing);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(req.file);
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url ,filename };
        await listing.save();
    }
    res.redirect(`/listings/${id}`);
};

//Delete Listing 

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};