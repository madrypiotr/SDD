Package.describe({
  summary: "Bootstrap styled version of login widgets",
  version: "0.3.10",
  git: "https://github.com/mangasocial/meteor-accounts-ui-bootstrap-3.git"
});

Package.on_use(function(api) {
  api.versionsFrom("METEOR@0.9.0");
  api.use(['session', 'handlebars', 'stylus', 'accounts-base', 'underscore', 'templating'], 'client');

  api.add_files([
    'accounts_ui.js',

    'login_buttons.html',
    'login_buttons_single.html',
    'login_buttons_dropdown.html',
    'login_buttons_dialogs.html',

    'login_buttons_session.js',

    'login_buttons.js',
    'login_buttons_single.js',
    'login_buttons_dropdown.js',
    'login_buttons_dialogs.js',
    'accounts_ui.styl'
  ], 'client');
});

Package.on_test(function(api) {
  //api.use('meteor-accounts-ui-bootstrap');
  //api.use('tinytest');
  //api.add_files('accounts_ui_tests.js', 'client');
});