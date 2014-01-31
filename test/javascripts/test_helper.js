/*jshint maxlen:250 */
/*global count:true find:true document:true equal:true sinon:true */

// Externals we need to load first
//= require vendor

//= require application

//= require jshint
//= require helpers/qunit_helpers

//= require_tree .
//= require_self
//= require jshint_all


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
  // Discourse.SiteSettings = jQuery.extend(true, {}, Discourse.SiteSettingsOriginal);
  // Discourse.BaseUri = "/";
  // Discourse.BaseUrl = "";
});