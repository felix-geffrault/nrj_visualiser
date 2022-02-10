const functions = require("firebase-functions");
const express = require("express");
const POI = require("../models/POI");
// eslint-disable-next-line new-cap
const router = express.Router();
const axios = require("axios").default;


const url = "https://api.openchargemap.io/v3/poi";
const OPEN_CHARGE_API_KEY = functions.config().opencharge.key;

router.get("/poi", async (req, res, next) => {
  const data = await axios
      .get(url, {
        params: req.query,
        headers: {"X-API-KEY": OPEN_CHARGE_API_KEY},
      })
      .then((response) => response.data)
      .catch((err) => res.status(500).json({error: err}));
  if (!req.user) return res.status(200).json(data);
  const user = req.user;
  const poiLiked = await POI.find({_id: {$in: user.POILiked}}).select("ID");
  const poiLikedIDs = poiLiked.map((poi) => parseInt(poi.ID));
  return res.status(200).json(data.map((poi) => {
    poi.isLiked = poiLikedIDs.includes(poi.ID) ? true : false;
    return poi;
  }));
},
);

router.post("/toggleLike", async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({error: req.t("opencharge.like.connexion.required")});
  }
  const poiSend = req.body;
  if (!poiSend.ID) {
    return res.status(400).json({error: req.t("opencharge.like.ID.required")});
  }
  let poi = await POI.findOne({ID: poiSend.ID});
  if (!poi) {
    poi = new POI(poiSend);
    await poi.save().then(() => console.log("POI saved")).catch((err) => {
      res.status(500).json({error: err}); // "Error during contact with database."
    });
  }
  if (!poi) return;
  const userPOILikedIndex = user.POILiked.indexOf(poi._id);
  if (userPOILikedIndex === -1) {
    user.POILiked.push(poi);
    user.save()
        .then(() => {
          res.status(200).json({success: req.t("opencharge.chargepoint.liked")});
        })
        .catch((err) => {
          res.status(500).json({error: err});
        });
  } else {
    user.POILiked.splice(userPOILikedIndex, 1);
    user.save()
        .then(() => {
          res.status(200).json({success: req.t("opencharge.chargepoint.unliked")});
        })
        .catch((err) => {
          res.status(500).json({error: err});
        });
  }
});

router.get("/liked", async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({error: req.t("connexion.required.feature")});
  }
  return res.status(200).json(await POI.find({_id: {$in: user.POILiked}}));
});
module.exports = router;
