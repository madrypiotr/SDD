Template.realizacjaTab2.helpers({
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
                {key: 'raporty', label: TXV.RAPORT, tmpl:Template.raport},
                { key: 'options', label: TXV.OPCJE, tmpl: Template.editColumnRealization }
            ]
        };
    },
    ZrealizowaneList: function () {
        return Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.ZREALIZOWANA]}}).fetch();
    },
    zrealizowaneCount: function () {
        return Kwestia.find({czyAktywny: true, status: KWESTIA_STATUS.ZREALIZOWANA}).count();
    },
    ZrealizowaneListCount: function () {
        var ile = Kwestia.find({czyAktywny: true, status: {$in:[KWESTIA_STATUS.ZREALIZOWANA]}}).count();
        return ile > 0 ? true : false;
    }
});

Template.realizacjaTab2.events({
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

        if(this.idZespolRealizacyjny){
            var realizationTeam = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny}).zespol;
            Meteor.call("serverGetFullName",realizationTeam,function(error,ret){
                if(!error){
                    membersNames=ret;
                    var docDefinition = {
                        content: [
                            { text: TXV.DATA +" " + moment(this.dataRealizacji).format("DD.MM.YYYY").toString() + " "+TXV.R, style: 'uchwalaTop'},
                            { text: globalParameters.nazwaOrganizacji + "\n" +
                            globalParameters.terytorium + "\n" +
                            globalParameters.kontakty + "\n"
                            },
                            { text: TXV.UCHWALA_NR + ": " + numerUchwaly + "\n\n\n\t\t" + TXV.DOTYCZY + ": " + issueName, style: 'uchwalaHeadline'},
                            { text: "\n\t\t\t\t\t\t" + issueContent, style: 'contentStyle'},
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