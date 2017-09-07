Template.listParametr.helpers({
    isUserCzlonek: function () {
        return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
    },
    noKwestiaParameters: function () {
        var kwestie = Kwestia.find({typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE, czyAktywny: true,
            status:{$nin:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.ARCHIWALNA]}});
        //status:{$in:[KWESTIA_STATUS.ADMINISTROWANA,KWESTIA_STATUS.GLOSOWANA]} } );
        return kwestie.count() > 0 ? false : true;
    }
});
Template.listParametr.events({
    'click #parametersClick': function (e) {
        e.preventDefault();
        var kwestia = Kwestia.findOne({typ:KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE,
            czyAktywny: true,status:{$nin:[KWESTIA_STATUS.ZREALIZOWANA]}});
        if (kwestia) {
            var path = null;
            path = '/issue_info/' + kwestia._id;
            Router.go(path);
        }
    },
    'click #editOrganisationName': function (e) {
        e.preventDefault();
        editParameter('nazwaOrganizacji', TAPi18n.__('txv.ORG_NAME'), this.nazwaOrganizacji);
    },
    'click #editTeritory': function (e) {
        e.preventDefault();
        editParameter('terytorium', TAPi18n.__('txv.TERITORY'), this.terytorium);
    },
    'click #editTeritAdres': function (e) {
        e.preventDefault();
        editParameter('terytAdres', TAPi18n.__('txv.TERITADR'), this.terytAdres);
    },
    'click #editTeritCODE': function (e) {
        e.preventDefault();
        editParameter('terytCODE', TAPi18n.__('txv.TERITCOD'), this.terytCODE);
    },
    'click #editTeritCity': function (e) {
        e.preventDefault();
        editParameter('terytCity', TAPi18n.__('txv.TERITCITY'), this.terytCity);
    },
    'click #editContacts': function (e) {
        e.preventDefault();
        editParameter('kontakty', TAPi18n.__('txv.CONTACTS'), this.kontakty);
    },
    'click #editStatute': function (e) {
        e.preventDefault();
        editParameter('regulamin', TAPi18n.__('txv.STATUT'), this.regulamin);
    },
    'click #editVoteDuration': function (e) {
        e.preventDefault();
        editParameter('voteDuration', TAPi18n.__('txv.VOTE_TIME'), this.voteDuration);
    },
    'click #editIssueWaiting': function (e) {
        e.preventDefault();
        editParameter('czasWyczekiwaniaKwestiiSpec', TAPi18n.__('txv.WAITING_TIME'), this.czasWyczekiwaniaKwestiiSpecjalnej);
    },
    'click #editVoteQuantity': function (e) {
        e.preventDefault();
        editParameter('voteQuantity', TAPi18n.__('txv.MAX_ISSUE_IN_VOTING'), this.voteQuantity);
    },
    'click #editIssuePause': function (e) {
        e.preventDefault();
        editParameter('addIssuePause', TAPi18n.__('txv.FREQ_ADD_ISSUE'), this.addIssuePause);
    },
    'click #editCommentPause': function (e) {
        e.preventDefault();
        editParameter('addCommentPause', TAPi18n.__('txv.FREQ_ADD_COMM'), this.addCommentPause);
    },
    'click #editReferencePause': function (e) {
        e.preventDefault();
        editParameter('addReferencePause', TAPi18n.__('txv.FREQ_ADD_REFER'), this.addReferencePause);

    },
    'click #editRRDuration': function (e) {
        e.preventDefault();
        editParameter('okresSkladaniaRR', TAPi18n.__('txv.FREQ_ADD_REPPO'), this.addReferencePause);
    }
});
editParameter = function (name,parameterName,value) {
    var obj = {
        name:name,
        title:parameterName,
        value:value
    };
    Session.setPersistent('chosenParameterSession',obj);
    $('#editParametrMod').modal('show');
};
