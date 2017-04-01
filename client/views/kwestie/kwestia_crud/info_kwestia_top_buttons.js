Template.kwestiaTopButtons.helpers({
    actualIssue:function(id){
        var issue=Kwestia.findOne({_id:id});
        return issue? issue : null;
    },
    hasUserRights: function(idKwestia) {
        if(!Meteor.userId())
            return "disabled";
        var user=Meteor.user().profile;
        if(user){
            if(user.userType) {
                if (user.userType != USERTYPE.CZLONEK)
                    return "disabled";
            }
        }
        return isKwestiaGlosowana(idKwestia);
    },
    isRealizowanaNieaktywny:function(status,czyAktywny){
        return (status==KWESTIA_STATUS.REALIZOWANA || status==KWESTIA_STATUS.ZREALIZOWANA) && czyAktywny==true ? true :false;
    },
    isGlobalParams:function(typ){
        return typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true : false;
    },
    isInZR:function(idZR){
        var zr=ZespolRealizacyjny.findOne({_id:idZR});
        return _.contains(zr.zespol,Meteor.userId()) ? true : false;
    },
    isZrealizowanaChangeParamsGlosowana:function(typ,status){
        if(Meteor.userId())
            return true;
        return status==KWESTIA_STATUS.ZREALIZOWANA || typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true :false;
    },
    isKwestiaAccessOrChangeParams:function(typ,status,czyAktywny){
        return typ==KWESTIA_TYPE.ACCESS_DORADCA ||
            typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY ||
            typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ||
            status==KWESTIA_STATUS.GLOSOWANA ||
            status==KWESTIA_STATUS.ZREALIZOWANA ||
            status==KWESTIA_STATUS.ARCHIWALNA ||
            czyAktywny==false ? true : false;
    },
    isKwestiaAccessOrChangeParamsRealizacja:function(typ,status,czyAktywny){
        return ((typ==KWESTIA_TYPE.ACCESS_DORADCA ||
        typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY ||
        typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) && (status==KWESTIA_STATUS.REALIZOWANA || status==KWESTIA_STATUS.ZREALIZOWANA) && czyAktywny==false) ||
        status==KWESTIA_STATUS.GLOSOWANA ||
        status==KWESTIA_STATUS.OCZEKUJACA ||
        status==KWESTIA_STATUS.ARCHIWALNA ||
        czyAktywny==false ? true : false;
    },
    isArchiwalna:function(status,typ){
        return _.contains([KWESTIA_STATUS.HIBERNOWANA,KWESTIA_STATUS.ARCHIWALNA],status) || typ==false ? true: false;
    }
});
Template.kwestiaTopButtons.events({
    'click #backToList': function (e) {
        window.history.back();
    },
    'click #addOptionButton': function () {
        var kwestiaCanBeInserted=kwestiaIsAllowedToInsert();
        if(kwestiaCanBeInserted==true) {
            var kw = null;
            var kwestia = Kwestia.findOne({_id: this.idKwestia});
            if (kwestia) {
                if (kwestia.idParent) {
                    if (kwestia.isOption == false)
                        kw = kwestia;
                    else
                        kw = Kwestia.findOne({idParent: kwestia.idParent});

                }
            }
            Session.setPersistent("actualKwestia", kw);
            Router.go("addKwestiaOpcja");
        }
        else
            notificationPauseWarning("kwestii",kwestiaCanBeInserted);
    },
/*    'click #doArchiwum': function (e) {
        e.preventDefault();
        var idKw = e.target.name;
        var issue=Kwestia.findOne({_id:idKw});
        if(isIssueAllowedToArchiveBin(issue)==true){
            var z = Posts.findOne({idKwestia: idKw, postType: "archiwum"});
            if (z) {
                $('html, body').animate({
                    scrollTop: $(".doArchiwumClass").offset().top
                }, 600);
            }
            else {
                $("#uzasadnijWyborArchiwum").modal("show");
            }
        }
    },
*/	
    'click #doKosza': function (e) {
        e.preventDefault();
        var idKw = e.target.name;
        var issue=Kwestia.findOne({_id:idKw});
        if(isIssueAllowedToArchiveBin(issue)==true) {
            var z = Posts.findOne({idKwestia: idKw, postType: "kosz"});
            if (z) {
                $('html, body').animate({
                    scrollTop: $(".doKoszaClass").offset().top
                }, 600);
            }
            else {
                $("#uzasadnijWyborKosz").modal("show");
            }
        }
    },
    'click #addRealizationReportClick': function (e) {
        e.preventDefault();
        var odp=getReportsForIssueAtSpecificDuration(this.idKwestia);
        if(odp==false)
            $("#addRRModal").modal("show");
        else{
            var className=".doRealizationRaportClass"+ odp._id;
            $('html, body').animate({
                 scrollTop: $(className).offset().top
             }, 600);
        }
    }
});

getReportsForIssueAtSpecificDuration=function(idKwestia){
    var timeNow = moment(new Date()).format();
    var issue=Kwestia.findOne({_id:idKwestia});
    var lastReportId=issue.raporty;
    var report=Raport.findOne({_id:_.last(issue.raporty)});
    if(report==null)
    return false;
    var reportAddedTime=report.dataUtworzenia;
    return reportAddedTime > _.last(issue.listaDatRR) ? report : false;
};

isIssueAllowedToArchiveBin=function(issue){
    if((issue.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE && issue.status==KWESTIA_STATUS.ZREALIZOWANA) ||
        (_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],issue.typ) && issue.status==KWESTIA_STATUS.REALIZOWANA))
    {
        var text=null;
        if(issue.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            text=TXV.GL_PAR_CHANGE1;
        if(issue.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            text=TXV.GL_PAR_CHANGE2;
        else
            text=TXV.GL_PAR_CHANGE3;
        bootbox.alert(TXV.GL_PAR_INFO+text+"!");
        return false;
    }
    return true;

};

