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

  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const bodyParams = new URLSearchParams({
    client_id: "myapp-client",
    grant_type: "authorization_code",
    code: req.query.code as string,
    redirect_uri: "http://localhost:3000/callback",
  });

  const url =
    "http://172.17.0.1:8080/realms/myapp/protocol/openid-connect/token";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  res.json(await response.json());
});

app.listen(3000, () => {
  console.log("Listeneing on port 3000");
});
