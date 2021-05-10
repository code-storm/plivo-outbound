import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
import express from "express";
import { config } from "./config";
const app = express();
const port = process.env.PORT || 5000;
var plivo = require("plivo");
var PhloClient = plivo.PhloClient;

app.use(express.urlencoded({ extended: true}));

var authId = config.PLIVO_AUTH_ID;
var authToken = config.PLIVO_AUTH_TOKEN;
var phloId = config.PLIVO_PHLOID;
var payload = {
  from: "+18663820815",
  to: null,
};

app.get("/", (req, res) => {
  res.send("GET request is working");
});

app.post("/connect", async (req, res) => {
  if (!req.body.to) {
    return res.status(500).json({
      message: '"to" parameter not present.',
    });
  }
  payload.to = req.body.to;
  const phloClient = new PhloClient(authId, authToken);
  try {
  const response = await phloClient
    .phlo(phloId)
    .run(payload)
  
    // .then(function (result) {
    //   console.log("Phlo run result", result);
    // })
    // .catch(function (err) {
    //   console.error("Phlo run failed", err);
    // });
  return res.json({ success: true, data: response });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message});
  }
});

app.post("/event-hook", (req, res) => {
  console.log("BODY: ",req.body, "HEADERS: ", req.headers);
  res.json({success: true});
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
