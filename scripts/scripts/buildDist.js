const fs = require("fs");
const path = require("path");
const { webpack } = require("webpack");
const yargs = require("yargs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

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
  fs.writeFileSync(
    path.resolve(__dirname, "..", "..", "build", "package.json"),
    JSON.stringify(newPackageJSON)
  );
}

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

const styleLoaders = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {},
  },
  {
    loader: require.resolve("css-loader"),
    options: { importLoaders: 1 },
  },
  {
    loader: require.resolve("postcss-loader"),
    options: {
      postcssOptions: {
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009",
            },
            stage: 3,
          }),
        ],
      },
    },
  },
];

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, "..", "config", "packageExports.tsx"),
  output: {
    path: path.resolve(__dirname, "..", "..", "build", "dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: path.resolve("src"),
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  customize: require.resolve(
                    "babel-preset-react-app/webpack-overrides"
                  ),
                  presets: [
                    [
                      require.resolve("babel-preset-react-app"),
                      {
                        runtime: "classic",
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: styleLoaders,
      },
    ],
  },
  resolve: {
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
  },
  plugins: [new MiniCssExtractPlugin()],
};

yargs
  .command("build", "build the dist for development by thired party", () => {
    cleanup();
    createPackageJSON();
    const compiler = webpack(webpackConfig);
    compiler.run((err, stats) => {
      if (err) {
        console.log("Error in webpack run", err);
        return;
      }
      if (stats.hasErrors()) {
        console.log(
          "Error in webpack run, hence displaying stats",
          stats.toJson()
        );
        return;
      }
      console.log("build/dist has been created");
    });
  })
  .help().argv;
