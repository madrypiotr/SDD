Template.administracjaUserMain.helpers({
    'settings': function () {
        return {
            rowsPerPage: 50,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'dataWprowadzenia', label: TAPi18n.__('txv.DATE_OF_INTRO'), tmpl: Template.dataUtwKwestia },
                { key: 'kwestiaNazwa', label: TAPi18n.__('glob.NameIssue'), tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TAPi18n.__('glob.Priority'), tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'ascending'},
                { key: 'options', label: TAPi18n.__('txv.OPTIONS'), tmpl: Template.lobbujZaKwestia }
            ]
        };
    },
    listOfIssues: function () {
        var kwestie = Kwestia.find({
            $where: function () {
                var userDraft=UsersDraft.findOne({_id:this.idUser});
                var condition=false;
                if(userDraft){
                    if(userDraft.profile.idUser){
                        if(userDraft.profile.idUser==Meteor.userId())
                        condition=true;
                    }
                }
                    return(this.czyAktywny==true && condition==true && (this.status!= KWESTIA_STATUS.ZREALIZOWANA && this.status!=KWESTIA_STATUS.REALIZOWANA)) ||

                    (((this.czyAktywny == true) && ((this.status==KWESTIA_STATUS.ADMINISTROWANA) || (this.idUser==Meteor.userId()))
                    || ((this.typ==KWESTIA_TYPE.ACCESS_DORADCA
                    || this.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY) )
                    || this.status==KWESTIA_STATUS.OCZEKUJACA
                    || this.idZglaszajacego==Meteor.userId())
                    && (this.status!= KWESTIA_STATUS.ZREALIZOWANA && this.status!=KWESTIA_STATUS.REALIZOWANA));
            }
        });
        if(kwestie) return kwestie;
        return null;
    },
    listOfIssuesCount: function () {
        var ile = Kwestia.find({czyAktywny: true}).count();
        return ile > 0 ? true : false;
    },
    myData:function(){
        return Meteor.user();
    },
    myKwestia:function(){
        var userDraft = UsersDraft.findOne({'profile.idUser': Meteor.userId(),czyAktywny:true});
        var kwestia=Kwestia.findOne({czyAktywny:true,
            typ:{$in:[KWESTIA_TYPE.ACCESS_ZWYCZAJNY]},idUser:userDraft._id});
        return kwestia? kwestia :null;
    },
    isDoradca:function() {
        return Meteor.user().profile.userType == USERTYPE.DORADCA ? true : false;
    },
    isCzlonek:function() {
        return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
    },
    kwestiaDraftExists:function(){
        var userDraf = UsersDraft.find({'profile.idUser': Meteor.userId(),czyAktywny:true});
        if (userDraf) {
            if (userDraf.count() ==0) return false;
            else return true;
        }
    },
});

Template.lobbujZaKwestia.helpers({
    IAmOwnerKwestiaGlosowanaOrDEliberowana:function(){
        var userDraft=UsersDraft.findOne({_id:this.idUser,czyAktywny:true});
        var condition=false;
        if(userDraft) {
            if (userDraft.profile.idUser) {
                if (userDraft.profile.idUser == Meteor.userId())
                    condition = true;
            }
        }
        return (this.idUser==Meteor.userId() || this.idZglaszajacego==Meteor.userId() || condition==true) && this.czyAktywny==true &&
        (this.status==KWESTIA_STATUS.GLOSOWANA ||
        this.status==KWESTIA_STATUS.DELIBEROWANA ||
        this.status==KWESTIA_STATUS.OSOBOWA ||
        this.status==KWESTIA_STATUS.ADMINISTROWANA) ? true: false;
    }
});

Template.lobbujZaKwestia.rendered=function(){

};
Template.lobbujZaKwestia.events({
   'click #lobbujZaKwestia':function(e){
       e.preventDefault();
       var idKwestia=this._id;
       var kwestia=Kwestia.findOne({_id:idKwestia});
       if(kwestia.lobbowana){
           if(moment(kwestia.lobbowana).add(24,'hours').format() > moment(new Date()).format()){
               GlobalNotification.warning({
                   title: TAPi18n.__('txv.INFO'),
                   content: TAPi18n.__('txv.NOT_POSS_LESS24'),
                   duration: 4
               });
           }
           else bootboxEmail(idKwestia);
       }
       else
           bootboxEmail(idKwestia);
   }
});
bootboxEmail=function(idKwestia){
    var form=bootbox.dialog({
        message:
        '<p><b>' + TAPi18n.__('txv.EMAIL_CONTENT') + '</b>' + TAPi18n.__('txv.ENCOURAGE') + '</p>' +
        '<div class="row">  ' +
        '<div class="col-md-12"> ' +
        '<form class="form-horizontal"> ' +
        '<div class="form-group"> ' +
        '<div class="col-md-12"> ' +
        '<textarea id="emailText" name="emailText" type="text"  class="form-control" rows=5></textarea> '+
        '</form> </div>  </div>',
        title: TAPi18n.__('txv.MESS_TO_MEMBER'),
        closeButton:false,
        buttons: {
            success: {
                label: "Wyślij",
                className: "btn-success successMessage",
                callback: function() {
                    $('.successMessage').css("visibility", "hidden");
                    sendEmailAndNotification(idKwestia,$('#emailText').val());
                }
            },
            danger: {
                label: TAPi18n.__('txv.CANCEL'),
                className: "btn-danger",
                callback: function() {
                    $('.btn-success').css("visibility", "visible");
                }
            }
        }
    });
};
sendEmailAndNotification=function(idKwestia,emailText){
    if(emailText==null || emailText.trim()==''){
        GlobalNotification.error({
            title: TAPi18n.__('txv.INFO'),
            content: FIELD_CONT_CNBE,
            duration: 4
        });
        bootboxEmail(idKwestia);
    }
    else{
        Meteor.call("updateKwestiaCzasLobbowana",idKwestia,new Date(),function(error){
            if(!error){
                addPowiadomienieLobbingIssueFunction(idKwestia,emailText);
                Meteor.call("sendEmailLobbingIssue", idKwestia,emailText,Meteor.userId(), getUserLanguage(), function(error){
                    if(error){
                        var emailError = {
                            idIssue: idKwestia,
                            type: NOTIFICATION_TYPE.LOOBBING_MESSAGE
                        };
                        Meteor.call("addEmailError", emailError);
                    }
                });
            }
            else{
                bootbox.alert(TAPi18n.__('txv.SEND_ERROR'), function() {
                });
            }
        });
    }
};

addPowiadomienieLobbingIssueFunction=function(idKwestia,uzasadnienie){
    var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
    var kwestia=Kwestia.findOne({_id:idKwestia});
    users.forEach(function(user){
        var newPowiadomienie ={
            idOdbiorca: user._id,
            idNadawca: Meteor.userId(),
            dataWprowadzenia: new Date(),
            tytul: "",
            powiadomienieTyp: NOTIFICATION_TYPE.LOOBBING_MESSAGE,
            tresc: "",
            uzasadnienie:uzasadnienie,
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
