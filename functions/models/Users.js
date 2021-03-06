const mongoose = require("mongoose");

const ThirdPartyProviderSchema = new mongoose.Schema({
  provider_name: {
    type: String,
    default: null,
  },
  provider_id: {
    type: String,
    default: null,
  },
  provider_data: {
    type: {},
    default: null,
  },
});

// Create Schema
const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      email_is_verified: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
      },
      third_party_auth: [ThirdPartyProviderSchema],
      date: {
        type: Date,
        default: Date.now,
      },
      POILiked: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "POI",
        },
      ],
    },
    {strict: false},
);

// eslint-disable-next-line no-undef
module.exports = User = mongoose.model("users", UserSchema);
