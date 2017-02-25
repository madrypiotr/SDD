Template.realizacjaTab1.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'dataRealizacji', label: TXV.START_REAL, tmpl: Template.dataRealizKwestia },
//                { key: 'numerUchwaly', label: TXV.UCHWALA_NR, tmpl: Template.numerUchwKwestia },
                { key: 'kwestiaNazwa', label: TXV.NAZ_KWESTI, tmpl: Template.nazwaKwestiLink },
                { key: 'idTemat', label: TXV.TEMAT, tmpl: Template.tematKwestia },
//                { key: 'idRodzaj', label: TXV.RODZAJ, tmpl: Template.rodzajKwestia },
                { key: 'raport', label: TXV.RAPORT, tmpl: Template.raport },
                { key: 'options', label: TXV.OPCJE, tmpl: Template.editColumnRealization }
            ]
        };
    }
});

Template.realizacjaTab1.events({
    'click #printResolution': function() {
        var globalParameters = Parametr.findOne({});
        var vote = this.glosujacy;
        var voteFor = 0;
        var voteAgainst = 0;
        var abstained = 0;
        var membersNames = new Array(3);
        var issueContent;
        for(i=0; i < 3; i++){
            membersNames[i] = "";
        }
        for(i = 0; i < vote.length; i++){
            if(vote[i].value>0){
                voteFor++;
            }else if(vote[i].value<0){
                voteAgainst++
            }else if(vote[i].value==0){
                abstained++
            }
        }

        if(this.typ == KWESTIA_TYPE.BASIC){
            issueContent = this.szczegolowaTresc;
        }else{
            issueContent = this.krotkaTresc;
        }
        var numerUchwaly=this.numerUchwaly.toString();
        var glosujacyLength=this.glosujacy.length;
        var issueName=this.kwestiaNazwa;
        var realizationDate=moment(this.dataRealizacji).format("DD.MM.YYYY").toString();

        if(this.idZespolRealizacyjny){
            var realizationTeam = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny}).zespol;
            Meteor.call("serverGetFullName",realizationTeam,function(error,ret){
                if(!error){
                    membersNames=ret;
                    var docDefinition = {
                        content: [
                            { text: TXV.DATA +" " + realizationDate + " " + TXV.R, style: 'uchwalaTop'},
                            { text: globalParameters.nazwaOrganizacji + "\n" +
                            globalParameters.terytorium + "\n" +
                            globalParameters.kontakty + "\n"
                            },
                            { text: TXV.UCHWALA_NR + ": " + numerUchwaly + "\n\n\n\t\t" + TXV.DOTYCZY + ": " + issueName, style: 'uchwalaHeadline'},
                            { text: "\n\t\t" +TXV.OPIS+": "+ issueContent, style: 'contentStyle'},
                            { text: "\n" +TXV.STAN_OSOB+" - " + glosujacyLength +
                            "\n"+TXV.OBECNYCH+"  - " + glosujacyLength +
                            "\n"+TXV.GLOS_ZA+" - " + voteFor +
                            "\n"+TXV.GL_PRZEC+" - " + voteAgainst +
                            "\n"+TXV.WSTRZ_SIE+" - " + abstained +
                            "\n\n"+TXV.ZESP_REAL+":" +
                            "\n1. - " + membersNames[0] +
                            "\n2. - " + membersNames[1] +
                            "\n3. - " + membersNames[2]
                            }
                        ],
                        styles: {
                            uchwalaTop: {fontSize: 12, alignment: 'right'},
                            uchwalaHeadline: {fontSize: 16, bold: true, alignment: 'center', margin: [0,50,0,50]},
                            contentStyle: {fontSize: 12, alignment: 'justify'}
                        }
                    };
                    pdfMake.createPdf(docDefinition).open();
                }else {
                    throwError(error);
                }
            });
        }else{
            var docDefinition = {
                content: [
                    { text: TXV.DN+" " + moment(this.dataRealizacji).format("DD.MM.YYYY").toString() +" "+TXV.R, style: 'uchwalaTop'},
                    { text: globalParameters.nazwaOrganizacji + "\n" +
                    globalParameters.terytorium + "\n" +
                    globalParameters.kontakty + "\n"
                    },
                    { text: TXV.UCHWALA_NR+": " + this.numerUchwaly.toString() + "\n"+ TXV.DOTYCZY + ": " + this.kwestiaNazwa , style: 'uchwalaHeadline'},
                    { text: "\n\t\t" +TXV.OPIS+": "+ issueContent, style: 'contentStyle'},
                    { text: "\n" +TXV.STAN_OSOB+" - " + this.glosujacy.length +
                    "\n"+TXV.OBECNYCH+"  - " + this.glosujacy.length +
                     "\n"+TXV.GLOS_ZA+" - " + voteFor +
                    "\n"+TXV.GL_PRZEC+" - " + voteAgainst +
                    "\n"+TXV.WSTRZ_SIE+" - " + abstained
                    }
                ],
                styles: {
                    uchwalaTop: {fontSize: 12, alignment: 'right'},
                    uchwalaHeadline: {fontSize: 16, bold: true, alignment: 'center', margin: [0,50,0,50]},
                    contentStyle: {fontSize: 12, alignment: 'justify'}
                }
            };
            pdfMake.createPdf(docDefinition).open();
        }
    }
});

Template.dataRealizKwestia.helpers({
    date: function () {
        var d = this.dataRealizacji;
        if (d) return moment(d).format("DD-MM-YYYY");
    }
});

Template.numerUchwKwestia.helpers({
    number: function () {
        return this.numerUchwaly;
    }
});

Template.listKwestiaRealzacjaColumnLabel.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};

Template.raport.helpers({
    reportCurrentDurationExists:function(raporty){
        var raportId= _.last(raporty);
        var issue=Kwestia.findOne({_id:this._id});
        if(raportId==null)
            return false;
        else{
            var report=Raport.findOne({_id: raportId});
            if(report){
                return report.dataUtworzenia > _.last(issue.listaDatRR) ? true : false;_
            }else {
                return false;
            }
        }
    },
    currentReport:function(raporty){
        var raport= _.first(raporty.reverse());
        return Raport.findOne({_id:raport});
    },
    hasZR:function(){
        var issue=Kwestia.findOne({_id:this._id});
        if(issue){
            if(issue.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                return false;
            else return true;
        }
    }
});
Template.raport.events({
    'click #showReport':function(e){
        e.preventDefault();
        lackOfRealizatonReport();
    }
});
lackOfRealizatonReport=function(){
    GlobalNotification.error({
    title: TXV.UWAGA,
    content: TXV.BRAK_RAP,
    duration: 4 // duration the notification should stay in seconds
    });
};
checkRRExists=function(raporty,param){
    //console.log("ZMIANA_PARAMS");
    var previousCheck = moment(new Date()).subtract(param, "days").format();
    var timeNow = moment(new Date()).format();
    var reports = Raport.find({
        _id: {$in: raporty},
        dataUtworzenia: {
            $gte: previousCheck,
            $lt: timeNow
       }
   });
    return reports;
};


