import express from "express";
const app = express();
const port = process.env.PORT || 5000;
var plivo = require("plivo");
var PhloClient = plivo.PhloClient;

app.use(express.urlencoded({ extended: true}));

var authId = "MAMWU3ZWM5YMZJNMY4ZM";
var authToken = "NjcwYzIzYzQ2MDc0MWQ3NGQyYTMzMGQ1MmI0YzA1";
var phloId = "9034bb69-2e8d-4311-875f-aa6230c33de4";
var payload = {
  from: "+18663820815",
  to: null,
};

app.get("/", (req, res) => {
  res.send("GET request is working");
});

app.post("/connect", (req, res) => {
  if (!req.body.to) {
    return res.status(500).json({
      message: '"to" parameter not present.',
    });
  }
  payload.to = req.body.to;
  const phloClient = new PhloClient(authId, authToken);
  phloClient
    .phlo(phloId)
    .run(payload)
    .then(function (result) {
      console.log("Phlo run result", result);
    })
    .catch(function (err) {
      console.error("Phlo run failed", err);
    });
  return res.json({ success: true });
});

app.post("/event-hook", (req, res) => {
  console.log("BODY: ",req.body, "HEADERS: ", req.headers);
  res.json({success: true});
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
