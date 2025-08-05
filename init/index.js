const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongourl = "mongodb://127.0.0.1:27017/wanderlust"

main() 
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongourl);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner : "68854fd7320487a02bb901dd",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();

