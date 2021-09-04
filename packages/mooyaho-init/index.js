#!/usr/bin/node
const download = require("download");
const os = require("os");
const path = require("path");
const fs = require("fs");
const tmpDir = os.tmpdir();
const crypto = require("crypto");

const { ncp } = require("ncp");

function generateHash() {
  return crypto.randomBytes(32).toString("hex");
}

const RELEASE_URL =
  "https://github.com/mooyaho-webrtc/mooyaho/archive/refs/tags/v.1.0.0-alpha.1.zip";
const fileName = path.basename(RELEASE_URL).replace(/\.zip$/, "");
const cwd = process.cwd();

async function initialize() {
  await download(RELEASE_URL, tmpDir, {
    extract: true,
  });
  const projectDirectory = path.join(tmpDir, `mooyaho-${fileName}`);
  const mooyahoEngineDirectory = path.join(
    projectDirectory,
    "/packages/mooyaho-engine"
  );

  const targetDirectory = path.join(cwd, "/mooyaho-engine");

  if (fs.existsSync(targetDirectory)) {
    console.error(
      "mooyaho-engine directory already exists in current directory"
    );
    return;
  }

  // copy mooyahoEngineDirectory recursively
  fs.mkdirSync(targetDirectory);
  const promise = new Promise((resolve, reject) => {
    ncp(mooyahoEngineDirectory, targetDirectory, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

  try {
    await promise;
  } catch (e) {
    console.error(e);
  }

  const env = `PORT=8080
SESSION_SECRET_KEY=${generateHash()}
API_KEY=${generateHash()}`;

  const envFileDir = path.resolve(targetDirectory, "./.env");
  fs.writeFileSync(envFileDir, env, "utf8");

  console.log(`mooyaho-engine initialized at ${targetDirectory}`);
}

initialize();
