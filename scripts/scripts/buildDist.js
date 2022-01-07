const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const { exec } = require("child_process");
function cleanup() {
  if (fs.existsSync("build/package.json")) {
    fs.rmSync("build/package.json");
  }
}

function createPackageJSON() {
  const packageJSON = require(path.resolve(
    __dirname,
    "..",
    "..",
    "package.json"
  ));
  const newPackageJSON = {
    name: packageJSON.name,
    main: packageJSON.main,
    version: packageJSON.version,
    types: packageJSON.types,
  };
  if (!fs.existsSync(path.resolve(__dirname, "..", "..", "build"))) {
    fs.mkdirSync(path.resolve(__dirname, "..", "..", "build"));
  }
  fs.writeFileSync(
    path.resolve(__dirname, "..", "..", "build", "package.json"),
    JSON.stringify(newPackageJSON)
  );
}

yargs
  .command("build", "build the dist for development by thired party", () => {
    cleanup();
    createPackageJSON();
    exec("tsc", (err, stdout, stderr) => {
      if (err) {
        console.log("error in executing exec 'tsx'");
      }
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }
    });
  })
  .help().argv;
