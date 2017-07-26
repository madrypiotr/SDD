Template.informacjeKwestia.helpers({
    isIssueRealizowana:function(){
        if(!Meteor.userId()) return false;
        if((this.status==KWESTIA_STATUS.REALIZOWANA) && this.typ!=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){
            return true;
        }
        else return false;
    },
    myselfInZR:function(){
        var zespol=null;
        zespol = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny});
        if (!zespol)
            zespol = ImplemTeamDraft.findOne({_id: this.idZespolRealizacyjny});
        if(zespol.idZR)
            zespol=ZespolRealizacyjny.findOne({_id: zespol.idZR});
        return _.contains(zespol.zespol,Meteor.userId()) ? true : false;
    }
});

Template.issueDetails.rendered = function () {
    if(Meteor.userId()==null)
        return;
    if(Meteor.user().profile.userType!=USERTYPE.CZLONEK || Meteor.user().roles == "admin")
        return;

    var idKwestia=Template.instance().data._id;
    var kwestia = Kwestia.findOne({_id: idKwestia});
    if(kwestia.status!=KWESTIA_STATUS.REALIZOWANA) {
        if (!_.contains(_.pluck(kwestia.glosujacy.slice(), 'idUser'), Meteor.userId())) {//jeżeli użytkownik jeszcze nie głosował
            var glosujacy = {
                idUser: Meteor.userId(),
                value: 0
            };
            var voters = kwestia.glosujacy.slice();
            voters.push(glosujacy);
            Meteor.call('setVotingTab', kwestia._id, voters, function (error, ret) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
            });
        }
    }

    if(Meteor.userId()) {
        var myNotifications = Powiadomienie.find({idOdbiorca: Meteor.userId(),
            powiadomienieTyp:{$in:[NOTIFICATION_TYPE.ISSUE_NO_PRIORITY,NOTIFICATION_TYPE.ISSUE_NO_PRIORITY_REALIZATION]},
            czyAktywny:true,czyOdczytany:false
        });
        myNotifications.forEach(function(powiadomienie){
               Meteor.call("setOdczytaneAktywnoscPowiadomienie",powiadomienie._id,true,false);
        });
    }
};
Template.issueDetails.created = function () {
    this.listaCzlonkow = new ReactiveVar();
};
Template.issueDetails.events({
    'click #dyskusja': function (e) {
        var id = document.getElementById("dyskusja").name;
        Router.go('dyskusjaKwestia', {_id: id})
    },
    'click .btn-success': function (event, template) {
        Session.set('kwestiaInScope', this);
    }
});

Template.issueDetails.helpers({
    anyEmailProblem:function(){
       return this.emailProblemNotification ? true : false;
    },
    isGlobalParamChange: function(){
        return this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true : false;
    },
    isIssueArchiwalna:function(){
        return this.status==KWESTIA_STATUS.ARCHIWALNA || this.status==KWESTIA_STATUS.HIBERNOWANA ? true : false;
    },
    isIssueHibernowana:function(){
        return this.status==KWESTIA_STATUS.HIBERNOWANA ? true : false;
    },
    isDeliberowana:function(){
        return this.status==KWESTIA_STATUS.DELIBEROWANA ? true :false;
    },
    isGlosowana:function(){
        return this.status==KWESTIA_STATUS.GLOSOWANA ? true :false;
    },
    isRealizowana:function(){
        return this.status==KWESTIA_STATUS.REALIZOWANA ? true :false;
    },
    isZrealizowana:function(){
        return this.status==KWESTIA_STATUS.ZREALIZOWANA ? true :false;
    },
    kwestiaInKosz:function(){
        return this.czyAktywny==false ? true : false;
    },
    wartoscPriorytetuG:function(){
        if(this.wartoscPriorytetu>0)
            return "+"+this.wartoscPriorytetu;
        else return this.wartoscPriorytetu;
    },
    // OPCJE
    ifHasOpcje: function () {
        var kwestiaGlownaId = this.idParent;
        var k = Kwestia.find({czyAktywny: true, idParent: kwestiaGlownaId, isOption: true});
        if (k) {
            if(k.count()>0)
                return true;
            else
                return false;
        }
    },
    //PRIORYTET
    mojPiorytet: function () {
        var kwestia = Kwestia.findOne({_id:this._id});
        if (kwestia) {
            var g=null;
            if(kwestia.status==KWESTIA_STATUS.REALIZOWANA)
                g = kwestia.glosujacyWRealizacji;
            else
                g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser) {
                    if (g[i].value > 0) {
                        g[i].value = "+" + g[i].value;
                        return g[i].value;
                    }
                    else {
                        return g[i].value;
                    }
                }
            }
        }
    },
    mojPriorytetZero: function () {
        var kwestia = Kwestia.findOne({_id:this._id});
        if (kwestia) {
            var g=null;
            if(kwestia.status==KWESTIA_STATUS.REALIZOWANA)
                g = kwestia.glosujacyWRealizacji;
            else
                g = kwestia.glosujacy;
            var flag=false;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser && g[i].value == 0)
                    flag=true;
            }
            return flag==true ? true : false;
        }
    },
    glosujacyCount: function () {
        var tab = Kwestia.findOne({_id:this._id});
        if (tab) {
            var liczba=null;
            if(tab.status==KWESTIA_STATUS.REALIZOWANA)
                liczba = tab.glosujacyWRealizacji.length;
            else
                liczba = tab.glosujacy.length;
            return liczba;
        }
    },
    //TEMAT I RODZAJ
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    },
    //DATY
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm");
    },
    dateVoteStart:function(){
        var d = this.startGlosowania;
        return (d) ? moment(d).format("DD-MM-YYYY, HH:mm") : "---";
    },
    dateVoteFinish: function () {
        var d = this.dataGlosowania;
        return (d) ? moment(d).format("DD-MM-YYYY, HH:mm") : "---";
    },
    //USERS
    isNotAdminOrDoradca: function () {
        if (Meteor.user()) {
            if (Meteor.user().roles) {
                if (Meteor.user().roles == "admin")
                    return false;
                else {
                    return Meteor.user().profile.userType !=USERTYPE.DORADCA ? false : true;
                }
            }
        }
        return false;
    },
    kworumComplete:function(){
        var kworum = liczenieKworumZwykle();
        var usersCount = this.glosujacy.length;
        return usersCount>=kworum ? true : false;
    },
    textKworum:function(){
        var kworum = liczenieKworumZwykle();
        var usersCount = this.glosujacy.length;
        var lock=kworum-usersCount;
        return lock == 1 ? lock + TAPi18n.__('txv.PERSON') : lock + TAPi18n.__('txv.PERSONS');
    },
    ZRComplete:function(){
        var zespol=null;
        if(this.zespol) {
            zespol = this.zespol.czlonkowie;
            return zespol.length >= 3 ? true : false;
        }
        else
            return getZRCount(this.idZespolRealizacyjny,this._id) >=3 ? true : false;
    },
    ZRText:function(){
        var count=null;
        if(this.zespol)
            count = this.zespol.czlonkowie.length;
        else
            count=getZRCount(this.idZespolRealizacyjny,null);
        var result=3-count;
        return (result > 1) ? result + TAPi18n.__('txv.MEMBERS') : result + TAPi18n.__('txv.MEMBER');
    },
    helperObserver:function(){
        if(this.status == KWESTIA_STATUS.OCZEKUJACA || this.status == KWESTIA_STATUS.GLOSOWANA ||
            this.status == KWESTIA_STATUS.REALIZOWANA || this.status == KWESTIA_STATUS.ZREALIZOWANA){
            $("#listZespolRealizacyjny").modal("hide");
            $("#listZespolRealizacyjnyDouble").modal("hide");
            $("#addNazwa").modal("hide");
            $("#decyzjaModalId").modal("hide");
            setTimeout(function(){
                return true;
            }, 2000);
        }
        return false;
    }
});
Template.issueManageZR.helpers({
    getZRName:function(idZR,zespol){
        if(zespol!=null)
            return zespol.nazwa;
        else {
            var zespol = null;
            zespol = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny});
            if (!zespol)
                zespol = ImplemTeamDraft.findOne({_id: this.idZespolRealizacyjny});
            if (zespol.idZR)
                zespol = ZespolRealizacyjny.findOne({_id: zespol.idZR});
            return zespol.nazwa;
        }
    },
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            filters: ['customFilter'],
            fields: [
                { key: 'profile.fullName', label: TAPi18n.__('txv.F_NAME')+" "+TAPi18n.__('txv.L_NAME') },
                { key: '_id', label: TAPi18n.__('txv.OPTIONS'), tmpl: Template.zrOptions }
            ],
            rowClass: function (item) {
                if(item._id==Meteor.userId())
                    return "myselfClass";
            }
        };
    },
    ZRList:function(){
        var zespol = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny});
        if(zespol){
            var users=Users.find({_id:{$in:zespol.zespol}});
            return users;
        }
    }
});

Template.zrOptions.helpers({
    currentUser:function(idUser){
        return idUser==Meteor.userId()? true :false;
    }
});

Template.zrOptions.events({
    'click #giveUpMembership':function(e){
        e.preventDefault();
        var idZR=document.getElementById("idZR").value;
        var zr=ZespolRealizacyjny.findOne({_id:idZR});
        if(zr._id=="jjXKur4qC5ZGPQkgN"){
            bootbox.alert(TAPi18n.__('txv.NO_EXIT_INFO1'));
        }
        else {
            var zespol = zr.zespol.length;
            if (zespol == 1)
                bootbox.alert(2)
            else {
                $("#zrCurrentIssueMyResolutions").modal("show");
            }
        }
    }
});

getZRCount=function(idZR,idIssue){
    var zespol = ZespolRealizacyjny.findOne({_id: idZR});
    if (!zespol) {
        zespol = ImplemTeamDraft.findOne({_id: idZR});
        if(zespol) {
            if (zespol.idZR) {
                var z = ZespolRealizacyjny.findOne({_id: zespol.idZR});
                if (z.kwestie.length > 0 && z.czyAktywny == true && idIssue != null) {
                    var issue = Kwestia.findOne({_id: idIssue});
                    if (issue.status == KWESTIA_STATUS.GLOSOWANA)
                        return 3;
                    else return zespol.zespol.length;
                }
                else return zespol.zespol.length;
            }
            else return zespol.zespol.length;
        }
    } else {
        return 0;
    }
};
