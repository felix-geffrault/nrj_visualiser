const mongoose = require("mongoose");

// Create Schema
const POISchema = new mongoose.Schema(
    {
      ID: Number,
      AddressInfo: {
        description: String,
        ID: Number,
        AddressLine1: String,
        AddressLine2: String,
        Town: String,
        StateOrProvince: String,
        Postcode: String,
        CountryID: Number,
      },
    },
    {strict: false},
);

// eslint-disable-next-line no-undef
module.exports = POI = mongoose.model("poi", POISchema);

