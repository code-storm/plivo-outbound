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
exports.PlivoApi = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const config_1 = require("./config");
const authId = config_1.config.PLIVO_AUTH_ID;
const authToken = config_1.config.PLIVO_AUTH_TOKEN;
class PlivoApi {
}
exports.PlivoApi = PlivoApi;
PlivoApi.makeCall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.to || !req.body.durationInSec) {
        throw new Error(" to or timeInSec parameter not present.");
    }
    const { to, durationInSec } = req.body;
    const hangupUrl = req.protocol + "://" + req.get("host") + "/event-hook";
    const data = qs_1.default.stringify({
        from: "+918826211131",
        to: to,
        answer_url: "https://s3.amazonaws.com/plivosamplexml/play_url.xml",
        answer_method: "GET",
        time_limit: durationInSec,
        hangup_url: hangupUrl
    });
    var config = {
        method: "post",
        url: `https://api.plivo.com/v1/Account/${authId}/Call/`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
        auth: {
            username: authId,
            password: authToken,
        },
    };
    const response = yield axios_1.default(config);
    return response.data;
});
//# sourceMappingURL=plivo-api.js.map