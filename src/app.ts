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
  const method = "POST";
  const url = "https://twin-node-server.herokuapp.com/event-hook";
  const [nonce, auth_token, signature, params] = ["00112514496856822964", "NjcwYzIzYzQ2MDc0MWQ3NGQyYTMzMGQ1MmI0YzA1", "TLN7rOiDF+ZPjMP+FlDp/QMl3cwEWDI7vBYGjxkQpD0=", {
    ALegRequestUUID: '4e7a1500-4240-4f75-aa5b-b995f0409299',
    ALegUUID: '4e7a1500-4240-4f75-aa5b-b995f0409299',
    AnswerTime: '2021-05-11 22:50:31',
    BillDuration: '60',
    BillRate: '0.032',
    CallStatus: 'completed',
    CallUUID: '4e7a1500-4240-4f75-aa5b-b995f0409299',
    Direction: 'outbound',
    Duration: '5',
    EndTime: '2021-05-11 22:50:36',
    Event: 'Hangup',
    From: '918826211131',
    HangupCause: 'ALLOTTED_TIMEOUT',
    HangupCauseCode: '6000',
    HangupCauseName: 'Scheduled Hangup',
    HangupSource: 'Plivo',
    ParentAuthID: 'MAMWU3ZWM5YMZJNMY4ZM',
    RequestUUID: '4e7a1500-4240-4f75-aa5b-b995f0409299',
    SessionStart: '2021-05-11 17:20:25.994819',
    StartTime: '2021-05-11 22:50:22',
    To: '918377803318',
    TotalCost: '0.03200' }];
    var validate = plivo.validateV3Signature(method, url, nonce, auth_token, signature, params);
  res.send("GET request is working" + validate);
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
  let headers = req.headers;
    console.log(headers);
    let signature = headers["x-plivo-signature-v3"];
    let nonce = headers["x-plivo-signature-v3-nonce"];
    // console.log("before,", signature, nonce);
    if (!signature) {
        signature = "signature";
    }
    if (!nonce) {
        nonce = "12345";
    }
    let url = req.protocol + "://" + req.get("host") + req.url;
    let auth_token = authToken;
    console.log(signature, nonce);
    let method = req.method;
    
    let validate;
        let params = req.body;
        console.log(method, url, nonce, auth_token, signature, params);
        validate = plivo.validateV3Signature(method, url, nonce, auth_token, signature, params);
    console.log(">>",validate);

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
