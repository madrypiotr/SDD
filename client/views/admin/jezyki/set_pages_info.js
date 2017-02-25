Template.setPagesInfo.helpers({
    getAllRoutes: function () {
        var tab = [];
        _.each(Router.routes, function (route) {
            var routeName = route.getName();
            var item = {
                routeName: routeName
            }
            tab.push(item);
        });
        return tab;
    },
    'getLabel': function (routeName) {
        var lang = Meteor.user().profile.language;
        var labelName = "pageInfo." + lang + "." + routeName;
        var label = TAPi18n.__(labelName);
        return label;
    },
    'getInfoText': function (routeName) {
        var self = Template.instance();
        var item = PagesInfo.findOne({idLanguage: self.data._id, routeName: routeName});
        return item.infoText ? item.infoText : "";
    }
});

Template.setPagesInfo.events({
    'submit form': function (e) {
        e.preventDefault();

        var idLang = this._id;
        var lang = Languages.findOne({_id: idLang});

        _.each(Router.routes, function (route) {
            var textInfo = $(e.target).find('[name=' + route.getName() + ']').val()
            var item = {
                idLanguage: idLang,
                routeName: route.getName(),
                shortLanguageName: lang.shortName,
                infoText: textInfo,
                czyAktywny: true
            }

            Meteor.call('setPagesInfo', item, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error(TXV.ERROR + error.reason);
                    else
                        throwError(error.reason);
                }
                else Router.go('listLanguages');
            });
        });
    },
    'reset form': function () {
        Router.go('listLanguages');
    },
    'click #infoTop': function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#infoDown").offset().top
        }, 600);
    },
    'click #infoDown': function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#infoTop").offset().top - 200
        }, 600);
    }
});
