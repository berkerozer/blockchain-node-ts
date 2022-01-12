import * as crypto from "crypto";
const storage = require("node-persist");

export const firstWallet = {
  privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1r1/lZLLan1m0
VIk+588ExcO6B9Tt0zQ9qo5Ll66NRRLdu10wgaM37KpZ2kkOSwtyRrq/8azLom+4
2OfTljdKppVq+noP2RWFkkRL0+qVke5q+NBBkyltyA/VXIU8K+2X7farTVDy2jpg
XnKRdvoMm27ZolFKqA6uhbMUf03a0fsLZm6ybnUjJipYHA9x++OqZJoqN4Amg/1/
RRz8EpVruTwU3wCtrLSYood2ZqSLN4xqIvJD1Qy1gnhgo9L5ttdOrlmeCYXhRZmp
8n5zr7ia7fTnyfnCeyOL0rmoKjIsXejQB4wTlDQVJYpWvs2nG81V31f+qT6V3VAc
gjkTrIebAgMBAAECggEANf4MLYujazz315NXxg31g6GR7PLu4E5ns/u/lc9Z3Dmu
xZ4sr4GXE8ONTG6GT20V1bwXO3uCsnFvaitrmYGGpPSkaspNA/CraKpzCWXMzO41
QCz5FsO5CBrwOaPpJFyZmxDowTeU2tbnikQHIBuPa7e1VY/bQKh41Hx/H5RFesVz
Je0tpxb4/y5va9De5AdFhHPq9kER0swHL1pnEGH3es9rvSFa7LPp/urxD11ZCLWK
0eEUiZ4YNLVNkLt/F+uBvgvz3oR+HrTJ6MGSGmchPK/e0eUZh5Ek5kLPYFktJmIa
/VKIG24vHAppXOhPNZAADIQdbHFa2ScUuyk90mm54QKBgQDxquB9dHB4eo2gMyXM
EbJylOGHLk8zyI1y3h8HmCGr5NZ5KwFjv/kWKVNtEiHXPa4yBOtAEsHqLJHYzaNq
dVODaiSwSkJKWW8cII3aayx6N8i/3WToOHQ1jhfoBlBtKX3azzbOJQH/o3cthleS
/8B4/82JYDeXKsxPoQhgDPh71QKBgQDAddAVCz8hHntuF0m4gc2MewU2E8b2j/Cg
dRFjiVzbDtArAoKZvy+PrQXPcDmLjc4UAG2A8ZQ9ySt69BkssQty5J7gqK+rX6Fh
BPUInUp29o7k/pDfh3fcLNfR9XERaYQvB4Z70PCZyMg2VhX+y8A0XL6oEn+mH5eg
0HfIyMXdrwKBgDBIuc2XBBmuMrm9PmIFbyfhgyXlJMHt4gT/SCfWR3P2prtS0lZB
ttysqRRzuPsuQa2Qugf1N3U4LnOosmvEwUjSXj4yuAfu0npGLtFi9GH+30cmTtDu
5pkEqNYc3NjSn2imWgbZ8gpHeLpJyxl9q9EBGunFpZW4YVXPkMLQFJ15AoGAdyt8
AMvJ9zPssapx13FoWUgDXgy48gsGsBRNBBkWCf4OH9OaEqEzTf+QzXVr7GGN7Qym
wWTUqb1a0vM6c1XdBPNS/UD2JWM9hdmP8BmU9jyNFnYaNo6nRQnvSO51aJaxZn1+
ZERn9pFAh4SecfqvtLyIwYFS0QZW2Ri8UvMesbkCgYEAsBb6ylvasSEVz0qEapZm
yb8UNuul962ZBIMKXVFgTbDiWGZVYlwmyGkYaSCgbrpmgJolfJF5CYgDRq7yLKGm
cX1RdBv3A34q6yZLvdVv7+SLZbn+9xqD7sOBYkT0Bo4sNBCtm6I/n2AONxoRZyZO
gSrjlXGyoeSOeVCsuq+kVDU=
-----END PRIVATE KEY-----`,
  publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAta9f5WSy2p9ZtFSJPufP
BMXDugfU7dM0PaqOS5eujUUS3btdMIGjN+yqWdpJDksLcka6v/Gsy6JvuNjn05Y3
SqaVavp6D9kVhZJES9PqlZHuavjQQZMpbcgP1VyFPCvtl+32q01Q8to6YF5ykXb6
DJtu2aJRSqgOroWzFH9N2tH7C2Zusm51IyYqWBwPcfvjqmSaKjeAJoP9f0Uc/BKV
a7k8FN8Aray0mKKHdmakizeMaiLyQ9UMtYJ4YKPS+bbXTq5ZngmF4UWZqfJ+c6+4
mu3058n5wnsji9K5qCoyLF3o0AeME5Q0FSWKVr7NpxvNVd9X/qk+ld1QHII5E6yH
mwIDAQAB
-----END PUBLIC KEY-----`,
};

class Transaction {
  constructor(
    public amount: number,
    public payer: string, //public key
    public payee: string //public key
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

class Block {
  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public time = Date.now()
  ) {}

  get hash() {
    const stringBlock = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(stringBlock).end();
    return hash.digest("hex");
  }
}

export class Chain {
  public static instance = new Chain();

  chain: Block[];

  constructor() {
    this.chain = [
      new Block("", new Transaction(100000, "genesis", firstWallet.publicKey)),
    ];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(nonce: number) {
    let solution = 1;
    console.log("⛏ mining...");

    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  addBlock(
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer
  ) {
    const verifier = crypto.createVerify("SHA256");
    verifier.update(transaction.toString());

    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }
}

export class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }
}

export const sendMoney = (
  amount: number,
  payerPublicKey: string,
  payerPrivateKey: string,
  payeePublicKey: string
) => {
  const transaction = new Transaction(amount, payerPublicKey, payeePublicKey);

  const sign = crypto.createSign("SHA256");
  sign.update(transaction.toString()).end();

  const signature = sign.sign(payerPrivateKey);
  Chain.instance.addBlock(transaction, payerPublicKey, signature);
};

export const getBalance = (publicKey: string) => {
  let balance = 0;
  Chain.instance.chain.map((block) => {
    if (block.transaction.payee === publicKey) {
      balance += block.transaction.amount;
    } else if (block.transaction.payer === publicKey) {
      balance -= block.transaction.amount;
    }
  });
  return balance;
};

//console.log(berker);

//console.log(Chain.instance);
