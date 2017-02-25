Template.listParametr.helpers({
    isUserCzlonek:function(){
        return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
    },
    noKwestiaParameters:function(){
        var kwestie=Kwestia.find({typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE, czyAktywny:true,
            status:{$nin:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.ARCHIWALNA]}});
        //status:{$in:[KWESTIA_STATUS.ADMINISTROWANA,KWESTIA_STATUS.GLOSOWANA]}});
        return kwestie.count()>0 ? false : true;
    }
});
Template.listParametr.events({
   'click #parametersClick':function(e){
       e.preventDefault();
       var kwestia=Kwestia.findOne({typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE,
           czyAktywny:true,status:{$nin:[KWESTIA_STATUS.ZREALIZOWANA]}});
       if(kwestia){
           var path=null;
           path="/issue_info/"+kwestia._id;
           Router.go(path);
       }
   },
    'click #editOrganisationName':function(e){
        e.preventDefault();
        editParameter("nazwaOrganizacji",TXV.ORG_NAME,this.nazwaOrganizacji);
    },
    'click #editTeritory':function(e){
        e.preventDefault();
        editParameter("terytorium",TXV.TERITORY,this.terytorium);
    },
    'click #editContacts':function(e){
        e.preventDefault();
        editParameter("kontakty",TXV.CONTACTS,this.kontakty);
    },
    'click #editStatute':function(e){
        e.preventDefault();
        editParameter("regulamin",TXV.STATUT,this.regulamin);
    },
    'click #editVoteDuration':function(e){
        e.preventDefault();
        editParameter("voteDuration",TXV.VOTE_TIME,this.voteDuration);
    },
    'click #editIssueWaiting':function(e){
        e.preventDefault();
        editParameter("czasWyczekiwaniaKwestiiSpec",TXV.WAITING_TIME,this.czasWyczekiwaniaKwestiiSpecjalnej);
    },
    'click #editVoteQuantity':function(e){
        e.preventDefault();
        editParameter("voteQuantity",TXV.MAX_ISSUE_IN_VOTING,this.voteQuantity);
    },
    'click #editIssuePause':function(e){
        e.preventDefault();
        editParameter("addIssuePause",TXV.FREQ_ADD_ISSUE,this.addIssuePause);
    },
    'click #editCommentPause':function(e){
        e.preventDefault();
        editParameter("addCommentPause",TXV.FREQ_ADD_COMM,this.addCommentPause);
    },
    'click #editReferencePause':function(e){
        e.preventDefault();
        editParameter("addReferencePause",TXV.FREQ_ADD_REFER,this.addReferencePause);

    },
    'click #editRRDuration':function(e){
        e.preventDefault();
        editParameter("okresSkladaniaRR",TXV.FREQ_ADD_REPPO,this.addReferencePause);
    }
});
editParameter=function(name,parameterName,value){
    var obj={
        name:name,
        title:parameterName,
        value:value
    };
    Session.setPersistent("chosenParameterSession",obj);
    $("#editParametrMod").modal("show");
};