const appConfig = require("./app.json");

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...appConfig.expo.extra,
    backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
  },
});
