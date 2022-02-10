const functions = require("firebase-functions");
const express = require("express");
const POI = require("../models/POI");
// eslint-disable-next-line new-cap
const router = express.Router();
const axios = require("axios").default;


const url = "https://api.openchargemap.io/v3/poi";
const OPEN_CHARGE_API_KEY = functions.config().opencharge.key;
router.get("/poi", (req, res, next) => {
  console.log(req.query);
  return axios.get(url, {
    params: req.query,
    headers: {"X-API-KEY": OPEN_CHARGE_API_KEY},
  }).then((response) => res.status(200).json(response.data))
      .catch((err) => res.status(500).json({error: err}));
});

router.post("/toggleLike", async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({error: req.t("opencharge.like.connexion.required")});
  }
  const poiSend = req.body;
  let poi = await POI.findOne({ID: poiSend.ID});
  if (!poi) {
    poi = new POI(poiSend);
    await poi.save().then(() => console.log("POI saved")).catch((err) => {
      res.status(500).json({error: err}); // "Error during contact with database."
    });
  }
  if (!poi) return;
  if (!user.POIliked.includes(poi._id)) {
    user.POIliked.push(poi);
    user.save()
        .then(() => res.status(200).json({success: req.t("opencharge.chargepoint.liked")}))
        .catch((err) => res.status(400).json({error: err}));
  } else {
    user.POIliked = user.POIliked.filter((prevLikedPoi) =>{
      /* console.log(prevLikedPoi._id);
      console.log(poi._id);
      console.log(prevLikedPoi.ID);
      console.log(poi.ID); */
      return prevLikedPoi !== poi;
    });
    console.log(user.POIliked);
    user.save()
        .then(() => res.status(200).json({success: req.t("opencharge.chargepoint.unliked")}))
        .catch((err) => res.status(400).json({error: err}));
  }
});

router.get("liked", (req, res, next) => {
  const user = req.user;
  if (!user) {
    return req.status(401).json({error: req.t("connexion.required.feature")});
  }
  return res.status(200).json(user.POIliked);
});
module.exports = router;
