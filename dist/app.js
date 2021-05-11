"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const plivo = require("plivo");
const plivo_api_1 = require("./plivo-api");
const model_1 = require("./model");
const config_1 = require("./config");
const app = express_1.default();
const port = process.env.PORT || 5000;
var allowlist = ["https://twin-node-server.herokuapp.com"];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (process.env.NODE_ENV === "development") {
        corsOptions = { origin: true };
    }
    else {
        if (allowlist.indexOf(req.header("Origin")) !== -1) {
            corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
        }
        else {
            corsOptions = { origin: false }; // disable CORS for this request
        }
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(express_1.default.urlencoded({ extended: true }));
var authId = config_1.config.PLIVO_AUTH_ID;
var authToken = config_1.config.PLIVO_AUTH_TOKEN;
// var plivoClient = new plivo.Client(authId,authToken);
app.get("/", cors_1.default(), (req, res) => {
    res.send("GET request is working");
});
app.post("/connect", cors_1.default(corsOptionsDelegate), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield plivo_api_1.PlivoApi.makeCall(req, res);
        return res.json({ success: true, data: response.data });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: e.message });
    }
}));
app.post("/event-hook", (req, res) => {
    console.log(">>>", req.headers['origin']);
    let headers = req.headers;
    console.log(headers);
    let signature = headers["x-plivo-signature-v2"];
    let nonce = headers["x-plivo-signature-v2-nonce"];
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
    model_1.db.OutboundCalls.create(outBoundCall)
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
//# sourceMappingURL=app.js.map