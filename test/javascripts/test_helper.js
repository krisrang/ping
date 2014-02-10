/*jshint maxlen:250 */
/*global count:true find:true document:true equal:true sinon:true */

//= require handlebars
//= require development/jquery.js
//= require development/ember.js

//= require ../../app/assets/javascripts/locales/i18n
//= require ../../app/assets/javascripts/ping/helpers/i18n_helpers
//= require ../../app/assets/javascripts/locales/en

// Externals we need to load first
//= require vendor
//= require preloader
//= require application

//= require jshint
//= require helpers/qunit_helpers

//= require_tree .
//= require_self
//= require jshint_all

window.assetPath = function() { return null; };

var oldAjax = $.ajax;
$.ajax = function() {
  try {
    this.undef();
  } catch(e) {
    console.error("Ping.Ajax called in test environment (" + arguments[0] + ")\n caller: " + e.stack.split("\n").slice(2).join("\n"));
  }
  return oldAjax.apply(this, arguments);
};

// Trick JSHint into allow document.write
var d = document;
d.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');
d.write('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing-container:hover { opacity: 0.5; } #ember-testing { zoom: 50%; } </style>');

Ping.rootElement = '#ember-testing';
Ping.setupForTesting();
Ping.injectTestHelpers();
Ping.runInitializers();
// Ping.deferReadiness();

QUnit.testStart(function() {
  // Allow our tests to change site settings and have them reset before the next test
  Ping.Settings = jQuery.extend(true, {}, Ping.SettingsOriginal);
});