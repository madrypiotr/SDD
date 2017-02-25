IsAdminUser = function () {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
};

getUserRadkingValue = function (idUser) {
    var user = Users.findOne({_id: idUser});
    if (user) {
        return Number(user.profile.rADking)
    }
};

getAllUsersWhoVoted = function (idKWestia) {
    var kwestia = Kwestia.findOne({_id: idKWestia});
    if (kwestia) {
        var tab = kwestia.glosujacy;
        if (tab) {
            var tabNew = [];
            for (var j = 0; j < tab.length; j++) {
                tabNew.push(tab[j].idUser);
            }
            return tabNew;
        }
    }
};

setRoles = function () {
    var roles = document.getElementById('role');
    if (roles) {
        Roles.getAllRoles().forEach(function (role) {
            var option = document.createElement("option");
            option.text = role.name;
            roles.add(option, null);
        });
    }
};

getEmail = function (_this) {
    if (_this.emails && _this.emails.length)
        return _this.emails[0].address;

    if (_this.services) {
        //Iterate through services
        for (var serviceName in _this.services) {
            var serviceObject = _this.services[serviceName];
            //If an 'id' isset then assume valid service
            if (serviceObject.id) {
                if (serviceObject.email) {
                    return serviceObject.email;
                }
            }
        }
    }
    return "";
};
//używane do walidacji na aplikacje na czlonka ,doradcę i przy confiramcji w nich
checkExistsUser=function(searchedEmail,userType1,userType2){
    var found = null;
    var userType=null;
    var users = Users.find();
    users.forEach(function (user) {
        _.each(user.emails, function (email) {
            if (_.isEqual(email.address.toLowerCase(), searchedEmail.toLowerCase())) {

                if(userType1 ==null && userType2==null)//dla przeszukania czy wgl jest taki user w systemie
                    found=true;
                else {
                    userType=user.profile.userType;
                    if (userType2 == null) {
                        if (userType == userType1) {//dla przeszukania czy doradca/czlonek jest w systemie
                            found = true;
                        }
                    }
                    else {
                        if (userType == userType1 || userType == userType2) {//dla przeszukania czy owy jest przynajmniej czlonkiem lub doradca
                            found = true;
                        }
                    }
                }
            }
        });
    });
    return found;
};
przyjecieWnioskuConfirmation=function(time,email,userTypeText){
    bootbox.dialog({
        message: "Twój wniosek aplikacyjny będzie oczekiwał (maksymalnie "+ time+" dzień/dni) na akceptację ogółu członków organizacji "+ getNazwaOrganizacji()+
        ". Po pozytywnym rozpatrzeniu otrzymasz informację w wiadomości na "+ email+", w której otrzymasz link aktywujący Twoje "+ userTypeText+ " dla nas.",
        title: "Uwaga",
        buttons: {
            main: {
                label: "Ok",
                className: "btn-primary"
            }
        }
    });
};
przyjecieWnioskuHonorowyConfirmation=function(time,email,userTypeText){
    bootbox.dialog({
        message: "Twój wniosek będzie oczekiwał (maksymalnie "+ time+" dzień/dni) na akceptację ogółu członków organizacji "+ getNazwaOrganizacji()+
        ". Po pozytywnym rozpatrzeniu osoba, którą wskazałeś otrzyma  informację w wiadomości na "+ email+", w której otrzyma link, gdzie będzie mógł potwierdzić/odrzucić chęć przynależności do oragnizacji jako "+ userTypeText+ " .",
        title: "Uwaga",
        buttons: {
            main: {
                label: "Ok",
                className: "btn-primary"
            }
        }
    });
};