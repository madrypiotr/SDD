//## Various auxiliary methods

getNazwaOrganizacji = function () {
    // ask for the name of the organization that uses this system
    return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji : TAPi18n.__('txv.ORG_NAME');
};

notificationPauseWarning = function (text, timeLeft) {
    // an alert indicating the necessary pause before you can perform the same operation again
    GlobalNotification.warning({
        title: TAPi18n.__('txv.SORRY'),
        content: TAPi18n.__('txv.THERE_IS_A_LIMIT_FREQUENCY_OF_ADDING') + text + TAPi18n.__('txv.NEXT_OF_THIS_TYPE_OF_ACTION_POSSIBLE_FOR') + timeLeft,
        duration: 5
	 });
};

recognizeSexMethod = function (userData) {
    // gender identification based on PESEL number
    var welcomeGender = null;
    if (userData.profile.pesel) {
        if (userData.profile.pesel != '') {
            var pesel = userData.profile.pesel.substring(9, 10);
            if (_.contains(['1', '3', '5', '7', '9'], pesel)) welcomeGender = TAPi18n.__('txv.HONORABLE');
            else welcomeGender = TAPi18n.__('txv.DEAR');
        } else welcomeGender = TAPi18n.__('txv.MR_MRS');
    } else welcomeGender = TAPi18n.__('txv.MR_MRS');
    return welcomeGender;
};

isInTab = function (item, tab) {
    // Checking the array
    var flag = false;
    tab.forEach(function (a) {
        if (a == item) flag = true;
	 });
    return flag;
};

// This function is probably not used. Make sure it is potentially useful
getUrlPathArray = function () {
    var pathArray = window.location.pathname.split('/');
    if (pathArray) {
        return pathArray;
    }
};

// This function is probably not used. Make sure it is potentially useful
getTabOfUrlParams = function () {
    var tab = [];
    var params = Router.current().params;
    for (var item in params) {
        if (!_.isEmpty(params[item])) tab.push(params[item]);
    }
    return tab;
};

// This function is probably not used. Make sure it is potentially useful
renderTmpForBootbox = function (template, data) {
    var node = document.createElement('div');
    document.body.appendChild(node);
    UI.renderWithData(template, data, node);
    return node;
};

// This function is probably not used. Make sure it is potentially useful
getLocalDate = function (date) {
    var dt = new Date(date);
    var minutes = dt.getTimezoneOffset();
    dt = new Date(dt.getTime() + minutes * 60000);
    return dt;
};

// This function is probably not used. Make sure it is potentially useful
stringContains = function (inputString, stringToFind) {
    return (inputString.indexOf(stringToFind) != -1);
};

// This function is probably not used. Make sure it is potentially useful
setParamInfo = function (paramName, initialValue, newValue) {
    var item = {
        paramName: paramName,
        initialValue: initialValue,
        newValue: newValue
    };
    return item;
};

// This function is probably not used. Make sure it is potentially useful
setValueIfEmptyField = function (field, value) {
    if (_.isEmpty(field)) {
        return value;
    }
    return field;
};
