// USERS

Meteor.publish('userTypeAndNames', function (id) {
    return Users.find({_id:id}, {fields: {
        'profile.fullName':1,
        'profile.userType': 1,
        'profile.firstName': 1,
        'profile.lastName': 1
    }});
});

Meteor.publish('usersRoles', function () {
    return Users.find({}, {fields: {roles: 1}});
});

Meteor.publish('usersType', function () {
    return Users.find({}, {fields: {'profile.userType': 1}});
});

Meteor.publish('usersUsernames', function () {
    return Users.find({}, {fields: {username: 1}});
});

Meteor.publish('usersFullNamesTypesRanking', function () {
    return Users.find({}, {fields: {'profile.firstName': 1,'profile.lastName': 1,'profile.fullName': 1,'profile.userType':1,'profile.rADking':1}});
});

Meteor.publish("usersTypeRanking",function(){
    return Users.find({}, {fields: {'profile.userType': 1,'profile.rADking':1}});
});

Meteor.publish('usersFullNames', function () {
    return Users.find({}, {fields: {'profile.fullName':1}});
});

Meteor.publish('usersTypeFullNames', function () {
    return Users.find({}, {fields: {'profile.fullName':1, 'profile.userType': 1}});
});

Meteor.publish('usersTypeAndNames', function () {
    return Users.find({}, {fields: {
        'profile.fullName':1,
        'profile.userType': 1,
        'profile.firstName': 1,
        'profile.lastName': 1
    }});
});

Meteor.publish('usersDraft', function () {
    return UsersDraft.find({});
});

Meteor.publish('userDraft', function (id) {
    return UsersDraft.find({idUser: id});
});

Meteor.publish('userDraftActivationLink', function (id) {
    return UsersDraft.find({_id: id}, {fields: {linkAktywacyjny: 1}})
});

Meteor.publish('userDraftByLinkAktywacyjny', function (linkAktywacyjny) {
    return UsersDraft.find({linkAktywacyjny: linkAktywacyjny});
});

Meteor.publish('usersDraftUserIdIsActive', function () {
    return UsersDraft.find({}, {fields: {'profile.idUser': 1, 'profile.userType': 1, czyAktywny:1}});
});

Meteor.publish('usersDraftEmailsUserTypeCzyAktywny', function () {
    return UsersDraft.find({}, {fields: {email: 1,'profile.userType':1,czyAktywny:1}});
});

Meteor.publish('usersEmailsUserType', function () {
    return UsersDraft.find({}, {fields: {email: 1,'profile.userType':1}});
});

Meteor.publish('usersDraftEmails', function () {
    return UsersDraft.find({}, {fields: {email: 1}});
});

Meteor.publish('usersRolesTypeUsernames', function () {
    return Users.find({}, {
        fields: {
            username: 1,
            'profile.userType': 1,
            roles: 1,
            'profile.firstName': 1,
            'profile.lastName': 1
        }
    });
});

Meteor.publish(null, function (){
    return Meteor.roles.find({})
});

Meteor.publish('subroles', function () {
    return Subroles.find({});
});

// RODZAJE

Meteor.publish('rodzaje', function () {
    return Rodzaj.find({});
});

Meteor.publish('rodzaj', function (id) {
    return Rodzaj.find({_id: id});
});

// TEMATY

Meteor.publish('tematy', function () {
    return Temat.find({});
});

Meteor.publish('temat', function (id) {
    return Temat.find({_id: id});
});

// PARAMETRY

Meteor.publish('parametr', function () {
    return Parametr.find({});
});

Meteor.publish('activeParametrDraft', function () {
    return ParametrDraft.find({czyAktywny:true});
});


// RAPORTY

Meteor.publish('raport', function () {
    return Raport.find({});
});

// KWESTIE

Meteor.publish('kwestie', function () {
    return Kwestia.find({});
});

Meteor.publish('kwestieNoDetails', function () {
    return Kwestia.find({},{fields: {szczegolowaTresc: 0}});
});

Meteor.publish('kwestiaNoDetails', function (id) {
    return Kwestia.find({_id:id},{fields: {szczegolowaTresc: 0}});
});

Meteor.publish('kwestieNoPeselEmailDetails', function () {
    return Kwestia.find({},{fields: {
        'szczegolowaTresc.email': 0,
        'szczegolowaTresc.pesel': 0
    }});
});

Meteor.publish('kwestia', function (id) {
    return Kwestia.find({_id: id});
});

Meteor.publish('kwestieOpcje', function (id) {
    return Kwestia.find({idParent: id});
});

Meteor.publish('kwestieOczekujace', function (status) {
    return Kwestia.find({status: status, czyAktywny: true})
});

Meteor.publish('kwestieNazwa', function () {
    return Kwestia.find({}, {fields: {kwestiaNazwa: 1,czyAktywny: 1}});
});

Meteor.publish('kwestieNazwaIdUserDataWprowadzenia', function () {
    return Kwestia.find({}, {fields: {kwestiaNazwa: 1,idUser:1,dataWprowadzenia:1, czyAktywny: 1}});
});

Meteor.publish('kwestieInfo', function () {
    return Kwestia.find({}, {
        fields: {
            kwestiaNazwa: 1,
            czyAktywny: 1,
            krotkaTresc: 1,
            szczegolowaTresc: 1,
            idTemat: 1,
            idRodzaj: 1
        }
    });
});

Meteor.publish('kwestieUser', function (id) {
    return Kwestia.find({idUser: id, czyAktywny: true})
});

Meteor.publish('kwestieGlosowane', function () {
    return Kwestia.find({czyAktywny: true,status:KWESTIA_STATUS.GLOSOWANA})
});

Meteor.publish('kwestieArchiwum', function () {
    return Kwestia.find({
        $or: [
            {czyAktywny: false},
            {status: KWESTIA_STATUS.ARCHIWALNA},
            {status: KWESTIA_STATUS.HIBERNOWANA}
        ]
    });
});

//POSTS

Meteor.publish('postsByKwestiaId', function (id) {
    return Posts.find({idKwestia: id, czyAktywny: true});
});

Meteor.publish('reportsByKwestiaId', function (id) {
    return Raport.find({idKwestia: id, czyAktywny: true});
});

Meteor.publish('allPosts', function () {
    return Posts.find({czyAktywny: true});
});

//LANGUAGES

Meteor.publish('languages', function () {
    return Languages.find({czyAktywny: true});
});

Meteor.publish('language', function (id) {
    return Languages.find({_id: id, czyAktywny: true});
});

//PAGES INFO

Meteor.publish('pagesInfo', function () {
    return PagesInfo.find({czyAktywny: true});
});

Meteor.publish('pagesInfoByLang', function (routeName) {
    return PagesInfo.find({routeName: routeName, czyAktywny: true});
});

//ZESPOL REALIZACYJNY

Meteor.publish('zespolyRealizacyjne', function(){
    return ZespolRealizacyjny.find({});
});

Meteor.publish('zespolRealizacyjny', function(id){
    return ZespolRealizacyjny.find({_id:id});
});

Meteor.publish('zespolyRealizacyjneDraft', function(){
    return ZespolRealizacyjnyDraft.find({});
});

Meteor.publish('kwestieRealizacja', function () {
    return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.REALIZOWANA});
});

Meteor.publish('kwestieZrealizowana', function () {
    return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.ZREALIZOWANA});
});

Meteor.publish('kwestieArrayStatus', function (array) {
    return Kwestia.find({czyAktywny: true, status: {$in:array}});
});

Meteor.publish('kwestieActivity', function (activity) {
    return Kwestia.find({czyAktywny: activity});
});

Meteor.publish('powiadomienia', function () {
    return Powiadomienie.find({czyAkywny:true});
});

Meteor.publish('myNotifications', function (idOdbiorca) {
    return Powiadomienie.find({idOdbiorca:idOdbiorca,czyAktywny:true});
});

Meteor.publish('notificationsNotReadIssue', function (idOdbiorca) {
    return Powiadomienie.find({idOdbiorca:idOdbiorca,czyAktywny:true},{fields: {czyOdczytany:1,idOdbiorca:1,czyAktywny:1,powiadomienieTyp:1}});
});

Meteor.publish('notificationsNotRead', function (idOdbiorca) {
    return Powiadomienie.find({idOdbiorca:idOdbiorca,czyAktywny:true},{fields: {czyOdczytany:1,idOdbiorca:1,czyAktywny:1}});
});

Meteor.publish('issueInNotification', function (notification) {
    if(notification.idKwestia!=null)
        return Kwestia.find({_id:{$in:[notification.idKwestia]}});
});

Meteor.publish('issuesInNotifications', function (idUser) {
    var powiadomienia=Powiadomienie.find({idOdbiorca:idUser});
    var array=[];
    powiadomienia.forEach(function(item){
        if(item.idKwestia!=null)
            array.push(item.idKwestia);
    });
    return Kwestia.find({_id:{$in:array}},{fields: {kwestiaNazwa:1}});
});

Meteor.publish("reportsIssuesRealization",function(){
    var issues=Kwestia.find({status:{$in:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.REALIZOWANA]}});
    var array=[];
    issues.forEach(function(issue){
        array.push(issue._id);
    });
    var reports=Raport.find({idKwestia:{$in:[array]}});
    return reports;
});

Meteor.publish("reports",function() {
    return Raport.find({});
});

Meteor.publish("report",function(idReport) {
    return Raport.find({_id:idReport});
});

Meteor.publish("reportsByIssue",function(idIssue){
    var issue=Kwestia.findOne({_id:idIssue});
    if(issue.raporty) {
        var reports = Raport.find({_id: {$in: issue.raporty}});
        return reports;
    }
    return null;
});

Meteor.publish("reportsIssue",function(idRaport){
   return Kwestia.find({},{$where: function () {
       var raporty=this.raporty;
       var flag=false;
       if(_.contains(raporty,idRaport))
        flag=true;
       return flag==true}});
});

Meteor.publish("userChangePassword", function (token) {
    var user = Users.find({'services.password.reset.token':token},{fields: {'services.password.reset': 1}});
    if(user){
        return user;
    }else{
        return false;
    }
});