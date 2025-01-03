import express from "express";
import session from "express-session";

const app = express();
app.use(express.urlencoded({ extended: true }));

const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
    //expires
  })
);

const middlewareIsAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-expect-error - type mismatch
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.get("/login", (req, res) => {
  //@ts-expect-error - type mismatch
  if (req.session.user) {
    return res.redirect("/admin");
  }
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const response = await fetch(
    "http://host.docker.internal:8080/realms/myapp/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "myapp-client",
        grant_type: "password",
        username,
        password,
        scope: "openid",
      }).toString(),
    }
  );

  const result = await response.json();
  console.log(result);
  //@ts-expect-error - type mismatch
  req.session.user = result;
  req.session.save();

  res.redirect("/admin");
});

app.get("/logout", (req, res) => {
  const logoutParams = new URLSearchParams({
    //@ts-expect-error
    id_token_hint: req.session.user.id_token,
    post_logout_redirect_uri: "http://localhost:3000/login",
  });

  req.session.destroy((err) => {
    console.log(err);
  });

  const url = `http://localhost:8080/realms/myapp/protocol/openid-connect/logout?${logoutParams.toString()}`;
  res.redirect(url);
});

app.get("/admin", middlewareIsAuth, (req, res) => {
  //@ts-expect-error - type mismatch
  res.json(req.session.user);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
