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
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const plivo_api_1 = require("./plivo-api");
const app = express_1.default();
const port = process.env.PORT || 5000;
var plivo = require("plivo");
// var PhloClient = plivo.PhloClient;
app.use(express_1.default.urlencoded({ extended: true }));
var authId = config_1.config.PLIVO_AUTH_ID;
var authToken = config_1.config.PLIVO_AUTH_TOKEN;
// var phloId = config.PLIVO_PHLOID;
// const phloClient = new PhloClient(authId, authToken);
var plivoClient = new plivo.Client(authId, authToken);
var payload = {
    from: "+18663820815",
    to: null,
};
app.get("/", (req, res) => {
    res.send("GET request is working");
});
app.get('/retrieve-call/:callId', (req, res) => {
    plivoClient.calls.get(req.params.callId).then(function (response) {
        console.log(response);
    }, function (err) {
        console.error(err);
    });
    res.json({});
});
app.post("/connect", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.get('host') + "/event-hook");
        const response = yield plivo_api_1.PlivoApi.makeCall(req, res);
        return res.json({ success: true, data: response.data });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: e.message });
    }
}));
app.post("/event-hook", (req, res) => {
    console.log("BODY: ", req.body, "HEADERS: ", req.headers);
    res.json({ success: true });
});
app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=app.js.map