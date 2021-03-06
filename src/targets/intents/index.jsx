/* global cozy, __DEVELOPMENT__ */

import "babel-polyfill";

import "styles";

import React from "react";
import { render } from "react-dom";
import { I18n } from "cozy-ui/react/I18n";

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require("preact/devtools");

  // Export React to window for the devtools
  window.React = React;
}

let appLocale;
const renderApp = function() {
  const IntentApp = require("components/IntentApp").default;
  render(
    <I18n
      lang={appLocale}
      dictRequire={appLocale => require(`locales/${appLocale}`)}
    >
      <IntentApp />
    </I18n>,
    document.querySelector("[role=application]")
  );
};

if (module.hot) {
  module.hot.accept("components/App", function() {
    renderApp();
  });
}

// return a defaultData if the template hasn't been replaced by cozy-stack
const getDataOrDefault = function(toTest, defaultData) {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/; // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest;
};

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[role=application]");
  const data = root.dataset;

  appLocale = getDataOrDefault(data.cozyLocale, "en");

  const protocol = window.location ? window.location.protocol : "https:";

  cozy.client.init({
    cozyURL: `${protocol}//${data.cozyDomain}`,
    token: data.cozyToken
  });

  renderApp();
});
