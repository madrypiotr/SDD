Template.header.created = function () {
    this.currentRouteNameRV = new ReactiveVar;
};

Template.header.rendered = function () {
    var self = Template.instance();
    this.autorun(function () {
        var routeName = Router.current().route.getName();
        self.currentRouteNameRV.set(routeName);
        self.subscribe('pagesInfoByLang', self.currentRouteNameRV.get());
    });
};

Template.header.helpers({
    'activeRouteClass': function (/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function (name) {
            return Router.current() && Router.current().route.getName() === name;
        });

        return active && 'active';
    },
    lessThanFiveUsers: function () {
        const users = Users.find({'profile.userType': USERTYPE.CZLONEK});
        return users && users.count() < 5;
    },
    issuesNotReadCount: function () {
        var powiad = Powiadomienie.find({idOdbiorca: Meteor.userId(), czyOdczytany: false, czyAktywny: true});
        return powiad ? powiad.count() : null;
    },
    anyNotRead: function () {
        var powiad = Powiadomienie.find({idOdbiorca: Meteor.userId(), czyOdczytany: false, czyAktywny: true});
        if (powiad)
            return powiad.count() > 0 ? true : false;
    },
    currentUser: function () {
        return Meteor.userId() ? true : false;
    }
});

Template.language.events({
    'click .lang': function (e) {
        var lang = e.target.textContent;
        if (lang) {
            var newUser = {
                profile: {
                    language: lang
                }
            };
            Session.set('language', lang);

            Meteor.call('updateUserLanguage', Meteor.userId(), newUser, function (error) {
                if (error) {
                    if (typeof Errors === 'undefined')
                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                    else
                        throwError(error.reason);
                } else {
                    TAPi18n.setLanguage(lang)
                        .done(function () {
                            console.log(TAPi18n.__('txv.LOAD_LANG'));
                        })
                        .fail(function (error_message) {
                            console.log(error_message);
                        });
                }
            });
        }
    },
    'click #showPageInfo': function () {

        var defaultLang = LANGUAGES.DEFAULT_LANGUAGE;
        var user = Meteor.user();
        var lang = null;
        if (user) {
            if (user.profile.language)
                lang = user.profile.language;
            else lang = defaultLang;
        } else lang = defaultLang;
        var routeName = Router.current().route.getName();
        var item = PagesInfo.findOne({shortLanguageName: lang, routeName: routeName});
        var title = TAPi18n.__('pageInfo.' + lang + '.' + routeName);
        bootbox.dialog({
            message: item.infoText ? item.infoText : TAPi18n.__('txv.NO_DESCR'),
            title: title
        });
    },

    'click #organizationName': function () {
        Router.go('home');
    }
});

Template.header.events({
    'change #notification-counter': function (e) {
        var value = $(e.target).val();
    },
    'click #newRootClick': function (e) {
        e.preventDefault();
        bootbox.confirm(TAPi18n.__('txv.FUTURE_FUNCTION'), function (result) {
        });
    }
});

Template.language.helpers({
    'getUserLang': function () {
        var user = Meteor.user();

        if (user && user.profile.language) {
            return Meteor.user().profile.language;
        }

        return Session.get('language') || LANGUAGES.DEFAULT_LANGUAGE;
    },
    'langs': function () {
        var langs = Languages.find({isEnabled: true, czyAktywny: true});
        if (langs) {
            return langs;
        }
    },
    nazwaOrg: function () {
        var param = Parametr.findOne({ });
        if (param) {
            var nazwa = param.nazwaOrganizacji;
            var users = Users.find({'profile.userType': USERTYPE.CZLONEK}).count();
            if (nazwa) {
                return nazwa + '  ' + users + TAPi18n.__('txv.PERSONS');
            }
            return 'none';
        }
    }
});
