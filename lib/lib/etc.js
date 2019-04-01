'use strict';

(Meteor.isClient ? window : global).Etc = Object.create(null);

Etc.getUserLanguage = function (user) {
    let defaultLang = 'pl';
    if (Meteor.isClient) {
        user = user || Meteor.user();
        defaultLang = Session.get('language') || defaultLang;
    }

    if (user && user.profile && user.profile.language) {
        return user.profile.language;
    }

    return defaultLang;
};

Etc.recognizeSexMethod = function (user, lang) {
    user = user || Meteor.user();
    lang = lang || Etc.getUserLanguage(user);
    // gender identification based on PESEL number
    if (user && user.profile && user.profile.pesel && user.profile.pesel !== '') {
        const pesel = user.profile.pesel.substring(9, 10);
        if (_.contains(['1', '3', '5', '7', '9'], pesel)) {
            return TAPi18n.__('txv.HONORABLE', null, lang);
        }
        return TAPi18n.__('txv.DEAR', null, lang);
    }
    return TAPi18n.__('txv.MR_MRS', null, lang);
};

Etc.getEmailFrom = function (name) {
    const nameFrom = name || 'SDD';
    const emailFrom = Meteor.settings.private && Meteor.settings.private.emailFrom;

    if (!emailFrom) {
        return nameFrom;
    }

    return name + ' <' + emailFrom + '>';
};
