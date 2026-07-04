const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// pnpm installs packages under .pnpm; help Metro resolve hoisted deps reliably.
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];
config.watchFolders = [projectRoot];

module.exports = config;
