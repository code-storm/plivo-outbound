import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import cors from "cors";
import plivo from "plivo";
import { PlivoApi } from "./plivo-api";
import { db } from "./model";
import { config } from "./config";
const app = express();
const port = process.env.PORT || 5000;
var allowlist = ["https://twin-node-server.herokuapp.com"];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (process.env.NODE_ENV === "development") {
    corsOptions = { origin: true };
  } else {
    if (allowlist.indexOf(req.header("Origin")) !== -1) {
      corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false }; // disable CORS for this request
    }
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(express.urlencoded({ extended: true }));

var authId = config.PLIVO_AUTH_ID;
var authToken = config.PLIVO_AUTH_TOKEN;
// var plivoClient = new plivo.Client(authId,authToken);

app.get("/", cors(), (req, res) => {
  res.send("GET request is working");
});

app.post("/connect", cors(corsOptionsDelegate), async (req, res) => {
  try {
    const response = await PlivoApi.makeCall(req, res);
    return res.json({ success: true, data: response.data });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.post("/event-hook", (req, res) => {
  console.log(">>>", req.headers['origin']);
  let headers = req.headers;
    console.log(headers);
    let signature = headers["x-plivo-signature-v2"] as string;
    let nonce = headers["x-plivo-signature-v2-nonce"] as string;
    if (!signature) {
        signature = "signature";
    }
    if (!nonce) {
        nonce = "12345";
    }
      let params = req.body;
      const validate = plivo.validateSignature(req.url, nonce, signature, authToken);
  console.log(validate);

  const plivoData = req.body;
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
      console.log(data);
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false, message: err });
    });
  // console.log("BODY: ",req.body, "HEADERS: ", req.headers);
  // res.json({success: true});
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
