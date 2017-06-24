Template.previewKwestiaOpcja.rendered=function(){
    document.getElementById("save").disabled = false;
};
Template.previewKwestiaOpcja.helpers({
    getTematName:function(id){
        return Temat.findOne({_id:id}).nazwaTemat;
    },
    getRodzajName:function(id){
        return Rodzaj.findOne({_id:id}).nazwaRodzaj;
    },
    isKwestiaOsobowa:function(){
        return this.status==KWESTIA_STATUS.OSOBOWA ? true :false;
    },
    protectorZR:function(){
        if(!Meteor.userId()) return false;
        var zr=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"});
        if(zr){
            if(zr.protector)
                return zr.protector==Meteor.userId() ? true : false;
        }
    }
});

Template.previewKwestiaOpcja.events({
    'click #cancel':function(){
        Session.set("actualKwestia",null);
        Router.go("listKwestia");
    },
    'click #save': function(e){
        e.preventDefault();
        document.getElementById("save").disabled = true;

        var kwestia = Session.get("actualKwestia");
        var newKwestiaOpcja = [{
            idUser: Meteor.userId(),
            dataWprowadzenia: new Date(),
            kwestiaNazwa: kwestia.kwestiaNazwa,
            wartoscPriorytetu: 0,
            wartoscPriorytetuWRealizacji: 0,
            idTemat: kwestia.idTemat,
            idRodzaj: kwestia.idRodzaj,
            dataDyskusji: kwestia.dataDyskusji,
            dataGlosowania: kwestia.dataGlosowania,
            dataRealizacji: null,
            czyAktywny: true,
            status: kwestia.status,
            krotkaTresc: kwestia.krotkaTresc,
            szczegolowaTresc: kwestia.szczegolowaTresc,
            idParent: kwestia.idParent,
            isOption: true,
            idZespolRealizacyjny:kwestia.idZespolRealizacyjny,
            typ:kwestia.typ
        }];
        var methodToCall=null;
        if(kwestia.status==KWESTIA_STATUS.OSOBOWA)
            methodToCall="addKwestiaOsobowaOpcja";
        else methodToCall="addKwestiaOpcja";
        Meteor.call(methodToCall, newKwestiaOpcja, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                Meteor.call("sendEmailAddedIssue", ret, getUserLanguage(), function(error) {
                    if(error){
                        var emailError = {
                            idIssue: ret,
                            type: NOTIFICATION_TYPE.NEW_ISSUE
                        };
                        Meteor.call("addEmailError", emailError);
                    }
                } );
                addPowiadomienieBasicOptionIssueFunction(ret,newKwestiaOpcja[0].dataWprowadzenia);
                var text="Nie odnotowaliśmy Twojej aktywności w następującej Kwestii:";
                addPowiadomienieIssueFunction(ret,newKwestiaOpcja[0].dataWprowadzenia,NOTIFICATION_TYPE.ISSUE_NO_PRIORITY,text);
                var userKwestia= Meteor.userId();
                var newValue=0;

                newValue=Number(RADKING.DODANIE_KWESTII)+getUserRadkingValue(userKwestia);

                Meteor.call('updateUserRanking', userKwestia,newValue, function (error) {
                    if (error)
                    {
                        if (typeof Errors === "undefined")
                            Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                        else {
                            throwError(error.reason);
                        }
                    }
                });

                Session.set("kwestiaPreviewOpcja",null);
                Session.set("actualKwestiaId",null);
                Router.go('listKwestia');
            }
        });
    }
});

addPowiadomienieBasicOptionIssueFunction=function(idKwestia,dataWprowadzenia){
    var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
    users.forEach(function(user){
        var newPowiadomienie ={
            idOdbiorca: user._id,
            idNadawca: null,
            dataWprowadzenia: dataWprowadzenia,
            tytul: "",
            powiadomienieTyp: NOTIFICATION_TYPE.NEW_ISSUE,
            tresc: "",
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany:false
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                throwError(error.reason);
        })
    });

};
