import express from "express";

const app = express();

app.get("/login", (req, res) => {
  const loginParams = new URLSearchParams({
    client_id: "myapp-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
  });
  const url = `http://localhost:8080/realms/myapp/protocol/openid-connect/auth?${loginParams.toString()}`;
  console.log(url);

  res.redirect(url);
});

app.get("/callback", (req, res) => {
  console.log(req.query);
  res.send("ok")
});

app.listen(3000, () => {
  console.log("Listeneing on port 3000");
});
