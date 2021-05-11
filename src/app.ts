import axios, { AxiosRequestConfig } from 'axios';
import qs from "qs";
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
import express from "express";
import { config } from "./config";
import { PlivoApi } from './plivo-api';
import { db } from './model';
const app = express();
const port = process.env.PORT || 5000;
var plivo = require("plivo");
// var PhloClient = plivo.PhloClient;

app.use(express.urlencoded({ extended: true}));

var authId = config.PLIVO_AUTH_ID;
var authToken = config.PLIVO_AUTH_TOKEN;
// var phloId = config.PLIVO_PHLOID;
// const phloClient = new PhloClient(authId, authToken);
var plivoClient = new plivo.Client(authId,authToken);
var payload = {
  from: "+18663820815",
  to: null,
};

app.get("/", (req, res) => {
  res.send("GET request is working");
});

app.get('/retrieve-call/:callId', (req, res) => {
  plivoClient.calls.get(
    req.params.callId, // call uuid
).then(function (response) {
    console.log(response);
}, function (err) {
    console.error(err);
});
res.json({});
})

app.post("/connect", async (req, res) => {
  
  try {
    const response = await PlivoApi.makeCall(req, res);
  
  return res.json({ success: true, data: response.data });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message});
  }
});

app.post("/event-hook", (req, res) => {
  const plivoData = req.body;
  const outBoundCall = {
    callStartTime: plivoData.AnswerTime,
    billDuration: +plivoData.BillDuration,
    billRate: +plivoData.BillRate,
    callStatus: plivoData.CallStatus,
    callUUID: plivoData.CallUUID,
    duration: +plivoData.Duration,
    callEndTime: plivoData.EndTime,
    cost: +plivoData.TotalCost
  }
  db.OutboundCalls.create(outBoundCall)
  .then(data => {
    console.log(data);
    res.json({success: true});
  })
  .catch(err =>{
    res.json({success: false, message: err});
  });
  // console.log("BODY: ",req.body, "HEADERS: ", req.headers);
  // res.json({success: true});
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
