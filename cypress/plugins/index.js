const { networkShim, chromeAllowXSiteCookies, cucumberPreprocessor } = require("@dhis2/cypress-plugins");

const cocumber = require("cypress-cucumber-preprocessor").default;

/* eslint-disable-next-line no-unused-vars */
module.exports = (on, config) => {
  on("file:preprocessor", cocumber());
  networkShim(on);
  chromeAllowXSiteCookies(on);
  cucumberPreprocessor(on, config);
};
