const functions = require("firebase-functions");
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const axios = require("axios").default;


const url = "https://api.openchargemap.io/v3/poi";
const OPEN_CHARGE_API_KEY = functions.config().opencharge.key;

router.post("", (req, res, next) => {
  return axios.post(url, req.body, {
    headers: {"X-API-KEY": OPEN_CHARGE_API_KEY},
  }).then((response) => response.data);
});

router.post("like", (req, res, next) => {
  const poiSend = req.body;
  const poi = POI.findOne({ID: poiSend.ID}).then(POI => {
    if(!POI) return POI(poiSend);
  });
  if(!POI).then(
    () => res.status(500).json({error: "Error during contact with database."})
  )
  const user = req.user;
  if (!user.objects.includes()) user.POIliked.push(req.body);
  user.save();

  return axios.post(url, req.body, {
    headers: {"X-API-KEY": OPEN_CHARGE_API_KEY},
  }).then((response) => response.data);
});)

module.exports = router;
