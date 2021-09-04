#!/usr/bin/node
const download = require("download");
const os = require("os");
const path = require("path");
const fs = require("fs");
const tmpDir = os.tmpdir();
const crypto = require("crypto");
const { ncp } = require("ncp");
const { exec } = require("child_process");

function isUsingYarn() {
  return (process.env.npm_config_user_agent || "").indexOf("yarn") === 0;
}

const [, , command, option] = process.argv;

function generateHash() {
  return crypto.randomBytes(32).toString("hex");
}

const RELEASE_URL =
  "https://github.com/mooyaho-webrtc/mooyaho/archive/refs/tags/v.1.0.0-alpha.1.zip";
const fileName = path.basename(RELEASE_URL).replace(/\.zip$/, "");
const cwd = process.cwd();

async function downloadArchive() {
  await download(RELEASE_URL, tmpDir, {
    extract: true,
  });
  const projectDirectory = path.join(tmpDir, `mooyaho-${fileName}`);
  return projectDirectory;
}

function installDeps(cwd) {
  const packager = isUsingYarn() ? "yarn" : "npm";

  return new Promise((resolve, reject) => {
    const child = exec(`${packager} install`, { cwd });

    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    child.on("error", (error) => {
      resolve(error);
    });
    child.addListener("exit", resolve);
  });
}

async function initializeEngine() {
  const projectDirectory = await downloadArchive();
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
    return;
  }

  const env = `PORT=8080
SESSION_SECRET_KEY=${generateHash()}
API_KEY=${generateHash()}`;

  const envFileDir = path.resolve(targetDirectory, "./.env");
  fs.writeFileSync(envFileDir, env, "utf8");

  await installDeps(targetDirectory);

  console.log(`mooyaho-engine initialized at ${targetDirectory}`);
}

async function initializeSFU() {
  const projectDirectory = await downloadArchive();
  const sfuDirectory = path.join(projectDirectory, "/packages/mooyaho-sfu");
  const targetDirectory = path.join(cwd, "/mooyaho-sfu");

  if (fs.existsSync(targetDirectory)) {
    console.error("mooyaho-sfu directory already exists in current directory");
    return;
  }

  // copy mooyahoEngineDirectory recursively
  fs.mkdirSync(targetDirectory);
  const promise = new Promise((resolve, reject) => {
    ncp(sfuDirectory, targetDirectory, (err) => {
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
    return;
  }

  await installDeps(targetDirectory);

  console.log(`mooyaho-sfu initialized at ${targetDirectory}`);
}

if (command === "init") {
  if (option === "engine") {
    initializeEngine();
  } else if (option === "sfu") {
    initializeSFU();
  }
}
