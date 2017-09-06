Template.realizacjaTab2.helpers ( {
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false, 
            enableRegex: false, 
            fields: [
                { key: 'dataRealizacji', label: TAPi18n.__ ( 'txv.START_OF_THE_IMPLEMENTATION' ), tmpl: Template.dataRealizKwestia },
                //                { key: 'numerUchwaly', label: TAPi18n.__ ( 'txv.RESOLUTION_NO' ), tmpl: Template.numerUchwKwestia },
                { key: 'kwestiaNazwa', label: TAPi18n.__ ( 'glob.NameIssue' ), tmpl: Template.nazwaKwestiLink },
                { key: 'idTemat', label: TAPi18n.__ ( 'glob.Subject' ), tmpl: Template.tematKwestia },
                //                { key: 'idRodzaj', label: TAPi18n.__ ( 'glob.Type' ), tmpl: Template.rodzajKwestia },
                {key: 'raporty', label: TAPi18n.__ ( 'txv.REPORT' ), tmpl:Template.raport},
                { key: 'options', label: TAPi18n.__ ( 'txv.OPTIONS' ), tmpl: Template.editColumnRealization }
            ]
        };
    },
    ZrealizowaneList: function () {
        return Kwestia.find ( {czyAktywny: true, status: {$in:[KWESTIA_STATUS.ZREALIZOWANA]} } ).fetch ();
    },
    zrealizowaneCount: function () {
        return Kwestia.find ( {czyAktywny: true, status: KWESTIA_STATUS.ZREALIZOWANA } ).count ();
    },
    ZrealizowaneListCount: function () {
        var ile = Kwestia.find ( {czyAktywny: true, status: {$in:[KWESTIA_STATUS.ZREALIZOWANA]} } ).count ();
        return ile > 0 ? true : false;
    }
} );

Template.realizacjaTab2.events ( {
    'click #printResolution': function () {
        var globalParameters = Parametr.findOne ( { } );
        var vote = this.glosujacy;
        var voteFor = 0;
        var voteAgainst = 0;
        var abstained = 0;
        var membersNames = new Array ( 3 );
        var issueContent;

        for ( i=0; i < 3; i++ ) {
            membersNames[i] = '';
        }
        for ( i = 0; i < vote.length; i++ ) {
            if ( vote[i].value>0 ) {
                voteFor++ ;
            }else if ( vote[i].value<0 ) {
                voteAgainst++; 
            }else if ( vote[i].value==0 ) {
                abstained++; 
            }
        }

        if ( this.typ == KWESTIA_TYPE.BASIC ) {
            issueContent = this.szczegolowaTresc;
        }else{
            issueContent = this.krotkaTresc;
        }
        var numerUchwaly=this.numerUchwaly.toString ();
        var glosujacyLength=this.glosujacy.length;
        var issueName=this.kwestiaNazwa;

        if ( this.idZespolRealizacyjny ) {
            var realizationTeam = ZespolRealizacyjny.findOne ( { _id: this.idZespolRealizacyjny } ).zespol;
            Meteor.call ( 'serverGetFullName',realizationTeam,function ( error,ret ) {
                if ( !error ) {
                    membersNames=ret;
                    var docDefinition = {
                        content: [
                            { text: TAPi18n.__ ( 'txv.DATA' ) + ' ' + moment ( this.dataRealizacji ).format ( 'DD.MM.YYYY' ).toString () + ' ' + TAPi18n.__ ( 'txv.R' ), style: 'uchwalaTop' },
                            { text: globalParameters.nazwaOrganizacji + '\n' + 
                            globalParameters.terytorium + '\n' + 
                            globalParameters.terytAdres + '\n' + 
                            globalParameters.terytCODE + '\n' + 
                            globalParameters.terytCity + '\n' + 
                            globalParameters.kontakty + '\n'
                            },
                            { text: TAPi18n.__ ( 'txv.RESOLUTION_NO' ) + ': ' + numerUchwaly + '\n\n\n\t\t' + TAPi18n.__ ( 'txv.BELONGS_TO_THE_ISSUES' ) + ': ' + issueName, style: 'uchwalaHeadline' },
                            { text: '\n\t\t\t\t\t\t' + issueContent, style: 'contentStyle' },
                            { text: '\n\t\t' + TAPi18n.__ ( 'txv.DESCRIPTION' ) + ': ' + issueContent, style: 'contentStyle' },
                            { text: '\n' + TAPi18n.__ ( 'txv.NUMBER_OF_USERS' ) + ' - ' + glosujacyLength + 
                            '\n' + TAPi18n.__ ( 'txv.NUMBER_OF_PRESENT' ) + '  - ' + glosujacyLength + 
                            '\n' + TAPi18n.__ ( 'txv.YES_NUMBER_OF_VOTERS' ) + ' - ' + voteFor + 
                            '\n' + TAPi18n.__ ( 'txv.NO_NUMBER_OF_VOTERS' ) + ' - ' + voteAgainst + 
                            '\n' + TAPi18n.__ ( 'txv.ABSTAINED_NUMBER_OF_VOTERS' ) + ' - ' + abstained + 
                            '\n\n' + TAPi18n.__ ( 'txv.TEAM_IMPLEMENTATION' ) + ':' + 
                            '\n1. - ' + membersNames[0] + 
                            '\n2. - ' + membersNames[1] + 
                            '\n3. - ' + membersNames[2]
                            }
                        ],
                        styles: {
                            uchwalaTop: {fontSize: 12, alignment: 'right' },
                            uchwalaHeadline: {fontSize: 16, bold: true, alignment: 'center', margin: [0,50,0,50]},
                            contentStyle: {fontSize: 12, alignment: 'justify' }
                        }
                    };
                    pdfMake.createPdf ( docDefinition ).open ();
                }
            } );
        } else {
            var docDefinition = {
                content: [
                    { text: TAPi18n.__ ( 'txv.DN' ) + ' ' + moment ( this.dataRealizacji ).format ( 'DD.MM.YYYY' ).toString () + ' ' + TAPi18n.__ ( 'txv.R' ), style: 'uchwalaTop' },
                    { text: globalParameters.nazwaOrganizacji + '\n' + 
                    globalParameters.terytorium + '\n' + 
                    globalParameters.terytAdres + '\n' + 
     globalParameters.terytCODE + '\n' + 
     globalParameters.terytCity + '\n' + 
                    globalParameters.kontakty + '\n'
                    },
                    { text: TAPi18n.__ ( 'txv.RESOLUTION_NO' ) + ': ' + this.numerUchwaly.toString () + '\n' + TAPi18n.__ ( 'txv.BELONGS_TO_THE_ISSUES' ) + ': ' + this.kwestiaNazwa , style: 'uchwalaHeadline' },
                    { text: '\n\t\t' + TAPi18n.__ ( 'txv.DESCRIPTION' ) + ': ' + issueContent, style: 'contentStyle' },
                    { text: '\n' + TAPi18n.__ ( 'txv.NUMBER_OF_USERS' ) + ' - ' + this.glosujacy.length + 
                    '\n' + TAPi18n.__ ( 'txv.NUMBER_OF_PRESENT' ) + '  - ' + this.glosujacy.length + 
                    '\n' + TAPi18n.__ ( 'txv.YES_NUMBER_OF_VOTERS' ) + ' - ' + voteFor + 
                    '\n' + TAPi18n.__ ( 'txv.NO_NUMBER_OF_VOTERS' ) + ' - ' + voteAgainst + 
                    '\n' + TAPi18n.__ ( 'txv.ABSTAINED_NUMBER_OF_VOTERS' ) + ' - ' + abstained
                    }
                ],
                styles: {
                    uchwalaTop: {fontSize: 12, alignment: 'right' },
                    uchwalaHeadline: {fontSize: 16, bold: true, alignment: 'center', margin: [0,50,0,50]},
                    contentStyle: {fontSize: 12, alignment: 'justify' }
                }
            };
            pdfMake.createPdf ( docDefinition ).open ();
        }
    }
} );
