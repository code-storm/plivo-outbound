import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import { config } from "./config";

const authId = config.PLIVO_AUTH_ID;
const authToken = config.PLIVO_AUTH_TOKEN;

export class PlivoApi {
  static makeCall = async (req, res) => {
    if (!req.body.to || !req.body.durationInSec) {
      throw new Error(" to or timeInSec parameter not present.");
    }
    const { to, durationInSec } = req.body;
    console.log("HANGUP URL : ", req.protocol + "://" + req.get("host") + "/event-hook");
    var data = qs.stringify({
      from: "+18663820815",
      to: to,
      answer_url: "https://s3.amazonaws.com/plivosamplexml/play_url.xml",
      answer_method: "GET",
      time_limit: durationInSec,
      hangup_url:  req.protocol + "://" + req.get("host") + "/event-hook",
    });
    var config: AxiosRequestConfig = {
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

    const response = await axios(config);
    return response.data;
  };
}
