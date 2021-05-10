"use strict";
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
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = process.env.PORT || 5000;
var plivo = require("plivo");
var PhloClient = plivo.PhloClient;
app.use(express_1.default.urlencoded({ extended: true }));
var authId = process.env.PLIVO_AUTH_ID;
var authToken = process.env.PLIVO_AUTH_TOKEN;
var phloId = process.env.PLIVO_PHLOID;
var payload = {
    from: "+18663820815",
    to: null,
};
app.get("/", (req, res) => {
    res.send("GET request is working");
});
app.post("/connect", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.to) {
        return res.status(500).json({
            message: '"to" parameter not present.',
        });
    }
    payload.to = req.body.to;
    const phloClient = new PhloClient(authId, authToken);
    try {
        const response = yield phloClient
            .phlo(phloId)
            .run(payload);
        // .then(function (result) {
        //   console.log("Phlo run result", result);
        // })
        // .catch(function (err) {
        //   console.error("Phlo run failed", err);
        // });
        return res.json({ success: true, data: response });
    }
    catch (e) {
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