Template.listLanguages.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'languageName', label: TAPi18n.__('txv.NAME'), tmpl: Template.nameLanguage},
                {key: 'shortName', label: TAPi18n.__('txv.SHORT_NAME'), tmpl: Template.shortNameLanguage},
                {key: '_id', label: TAPi18n.__('txv.OPTIONS'), tmpl: Template.languageOptions, headerClass: 'col-md-3'}
            ]
        };
    },
    languages: function () {
        return Languages.find({}).fetch();
    },
    languageCount: function () {
        return Languages.find().count();
    }
});


Template.languageOptions.helpers({
    'isLangEnabled': function (id) {
        var item = Languages.findOne({_id: id}).isEnabled;
        return item ? item : false;
    }
});

Template.languageOptions.events({
    'click #launchLang': function (e) {
        var id = $(e.target).attr('name');

        var lang = {
            isEnabled: true
        };
        Meteor.call('updateLanguageEnabled', id, lang, function (error) {
            if (error) {
                if (typeof Errors === 'undefined')
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else {
                    throwError(error.reason);
                }
            } else {
                Router.go('listLanguages');
            }
        });
    },
    'click #hideLang': function (e) {
        var id = $(e.target).attr('name');

        var lang = {
            isEnabled: false
        };
        Meteor.call('updateLanguageEnabled', id, lang, function (error) {
            if (error) {
                if (typeof Errors === 'undefined')
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else {
                    throwError(error.reason);
                }
            } else {
                Router.go('listLanguages');
            }
        });
    }
});

Template.listLanguages.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};

Template.languageOptions.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};
