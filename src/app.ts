import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import cors from "cors";
const plivo = require("plivo");
import { PlivoApi } from "./plivo-api";
import { db } from "./model";
import { config } from "./config";
const app = express();
const port = process.env.PORT || 5000;

const whitelist = ["https://code-storm.github.io", "https://twin-node-server.herokuapp.com"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.urlencoded({ extended: true }));

var authToken = config.PLIVO_AUTH_TOKEN;

app.get("/", cors(), (req, res) => {
  res.send("GET request is working");
});

app.post("/connect", cors(corsOptions), async (req, res) => {
  try {
    const response = await PlivoApi.makeCall(req, res);
    return res.json({ success: true, data: response.data });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.post("/event-hook", cors(corsOptions), (req, res) => {
  const headers = req.headers;
  let signature = headers["x-plivo-signature-v3"];
  let nonce = headers["x-plivo-signature-v3-nonce"];
  if (!signature) {
    signature = "signature";
  }
  if (!nonce) {
    nonce = "12345";
  }
  let url = req.protocol + "://" + req.get("host") + req.url;
  let auth_token = authToken;
  let method = req.method;

  const plivoData = req.body;
  const validate = plivo.validateV3Signature(
    method,
    url,
    nonce,
    auth_token,
    signature,
    plivoData
  );
  console.log(">>", validate);
  if (!validate) {
    return res.status(500).json({ success: false, message: "Invalid data" });
  }
  const outBoundCall = {
    callStartTime: plivoData.AnswerTime,
    billDuration: +plivoData.BillDuration,
    billRate: +plivoData.BillRate,
    callStatus: plivoData.CallStatus,
    callUUID: plivoData.CallUUID,
    duration: +plivoData.Duration,
    callEndTime: plivoData.EndTime,
    cost: +plivoData.TotalCost,
  };
  db.OutboundCalls.create(outBoundCall)
    .then((data) => {
      res.status(201).json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err });
    });
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
