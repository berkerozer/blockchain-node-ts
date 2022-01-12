import express, { Request, Response } from "express";
import * as crypto from "crypto";
import {
  Wallet,
  Chain,
  getBalance,
  firstWallet,
  sendMoney,
} from "./blockchain";

var hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");

console.log(Chain.instance.chain);

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.set("view engine", "hbs");

app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.post("/", (req: Request, res: Response) => {
  const priv = req.body.privateKey.replace(/(\r)/gm, "");
  const publ = req.body.publicKey.replace(/(\r)/gm, "");
  const balance = getBalance(publ);
  res.render("index", {
    instance: {
      publicKey: publ,
      privateKey: priv,
      balance,
    },
  });
});

app.post("/transection", (req: Request, res: Response) => {
  const payerpriv = req.body.payerPrivateKey.replace(/(\r)/gm, "");
  const payerpubl = req.body.payerPublicKey.replace(/(\r)/gm, "");
  const payeepubl = req.body.publicKey.replace(/(\r)/gm, "");

  const balance = getBalance(payerpubl);

  const amount = parseInt(req.body.amount);

  console.log(req.body, balance, amount);

  if (balance >= amount) {
    sendMoney(amount, payerpubl, payerpriv, payeepubl);

    const newBalance = getBalance(payerpubl);

    res.render("index", {
      instance: {
        publicKey: payerpubl,
        privateKey: payerpriv,
        balance: newBalance,
      },
    });
  } else {
    res.send("Yetersiz Bakiye");
  }
});

app.get("/createwallet", (req: Request, res: Response) => {
  const wallet = new Wallet();
  res.render("createwallet", {
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
  });
});

app.get("/firstwallet", (req: Request, res: Response) => {
  res.send(firstWallet);
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

app.listen(3000, () =>
  console.log("Server listening on http://localhost:3000")
);
