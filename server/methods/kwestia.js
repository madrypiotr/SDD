Meteor.methods({
    // metody Kwestia GŁÓWNA
    addKwestia: function (newKwestia) {
        var z = ImplemTeamDraft.insert({nazwa: '', zespol: []});
        const issueNumber = Meteor.call('generateNextIssueNumber');

        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: newKwestia[0].dataGlosowania,
            dataRealizacji: newKwestia[0].dataRealizacji,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            glosujacyWRealizacji:[],
            isOption: false,
            numerUchwaly: newKwestia[0].numerUchwaly,
            typ:newKwestia[0].typ,

            idZespolRealizacyjny: z,
            issueNumber: issueNumber
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        return id;
    },
    addKwestiaOsobowa: function (newKwestia) {
        const issueNumber = Meteor.call('generateNextIssueNumber');

        var id = Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: newKwestia[0].dataGlosowania,
            dataRealizacji: newKwestia[0].dataRealizacji,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            glosujacyWRealizacji:[],
            isOption: false,
            numerUchwaly: newKwestia[0].numerUchwaly,
            idZespolRealizacyjny: newKwestia[0].idZespolRealizacyjny,
            typ:newKwestia[0].typ,
            issueNumber: issueNumber
        });
        Kwestia.update({_id: id}, {$set: {idParent: id}}, {upsert: true});
        return id;
    },
    addKwestiaADMINISTROWANA: function (newKwestia) {
        const issueNumber = Meteor.call('generateNextIssueNumber');

        return Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            startGlosowania:newKwestia[0].startGlosowania,
            dataGlosowania: null,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            idParametr : newKwestia[0].idParametr,
            typ:newKwestia[0].typ,
            issueNumber: issueNumber
        });
    },
    addKwestiaOpcja: function (newKwestiaOpcja) {
        const issueNumber = Meteor.call('generateNextIssueNumber');

        const idKwestia = Kwestia.insert({
            idUser: Meteor.userId(),
            dataWprowadzenia: newKwestiaOpcja[0].dataWprowadzenia,
            kwestiaNazwa: newKwestiaOpcja[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestiaOpcja[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestiaOpcja[0].wartoscPriorytetuWRealizacji),
            idTemat: newKwestiaOpcja[0].idTemat,
            idRodzaj: newKwestiaOpcja[0].idRodzaj,
            dataDyskusji: newKwestiaOpcja[0].dataDyskusji,
            dataGlosowania: newKwestiaOpcja[0].dataGlosowania,
            dataRealizacji: newKwestiaOpcja[0].dataRealizacji,
            czyAktywny: newKwestiaOpcja.czyAktywny = true,
            status: newKwestiaOpcja.status = KWESTIA_STATUS.DELIBEROWANA,
            krotkaTresc: newKwestiaOpcja[0].krotkaTresc,
            szczegolowaTresc: newKwestiaOpcja[0].szczegolowaTresc,
            glosujacy: [],
            glosujacyWRealizacji:[],
            isOption: true,
            idParent: newKwestiaOpcja[0].idParent,
            numerUchwaly: newKwestiaOpcja[0].numerUchwaly,
            typ:newKwestiaOpcja[0].typ,
            issueNumber: issueNumber
        });

        const zId = ImplemTeamDraft.insert({idKwestia, nazwa: '', zespol: []});
        Kwestia.update({_id: idKwestia}, {$set: {
            idZespolRealizacyjny: zId
        }});
    },
    addKwestiaOsobowaOpcja: function (newKwestia) {
        const issueNumber = Meteor.call('generateNextIssueNumber');

        return Kwestia.insert({
            idUser: newKwestia[0].idUser,
            dataWprowadzenia: newKwestia[0].dataWprowadzenia,
            kwestiaNazwa: newKwestia[0].kwestiaNazwa,
            wartoscPriorytetu: parseInt(newKwestia[0].wartoscPriorytetu),
            wartoscPriorytetuWRealizacji: parseInt(newKwestia[0].wartoscPriorytetuWRealizacji),
            idTemat: newKwestia[0].idTemat,
            idRodzaj: newKwestia[0].idRodzaj,
            dataDyskusji: newKwestia[0].dataDyskusji,
            dataGlosowania: newKwestia[0].dataGlosowania,
            dataRealizacji: newKwestia[0].dataRealizacji,
            czyAktywny: newKwestia[0].czyAktywny = true,
            status: newKwestia[0].status,
            krotkaTresc: newKwestia[0].krotkaTresc,
            szczegolowaTresc: newKwestia[0].szczegolowaTresc,
            glosujacy: [],
            glosujacyWRealizacji:[],
            isOption: true,
            numerUchwaly: newKwestia[0].numerUchwaly,
            idZespolRealizacyjny: newKwestia[0].idZespolRealizacyjny,
            idParent: newKwestia[0].idParent,
            typ:newKwestia[0].typ,
            issueNumber: issueNumber
        });
    },

    updateIssueRating: function (id, obj) {
        return Kwestia.update(id, {
            $set: {
                wartoscPriorytetu: obj[0].wartoscPriorytetu,
                glosujacy: obj[0].glosujacy
            }
        }, {upsert: true});
    },

    UpdateIssueInImplemRating: function (id, obj) {
        return Kwestia.update(id, {
            $set: {
                wartoscPriorytetuWRealizacji: obj[0].wartoscPriorytetuWRealizacji,
                glosujacyWRealizacji: obj[0].glosujacyWRealizacji
            }
        }, {upsert: true});
    },

    setVotingTab: function (id, obj) {
        return Kwestia.update(id, {$set: {glosujacy: obj}}, {upsert: true});
    },

    // This function is probably not used. Make sure it is potentially useful
    updateWartoscPriorytetu: function (id, obj) {
        return Kwestia.update(id, {$set: {wartoscPriorytetu: obj}}, {upsert: true});
    },

    updateIssueStatus: function (id, status) {
        return Kwestia.update(id, {$set: {status: status}}, {upsert: true});
    },

    updateStatusNoResolRealizIssuesDate: function (id, status,numerUchwaly,data) {
        return Kwestia.update(id, {
            $set: {status: status,numerUchwaly:numerUchwaly,dataRealizacji:data}
        }, {
            upsert: true
        });
    },

    updStatNoResDatReaIdImplTeam: function (id, status, numerUchwaly, dataRealizacji,idZR) {
        return Kwestia.update(id, {
            $set: {
                status: status,
                numerUchwaly: numerUchwaly,
                dataRealizacji: dataRealizacji,
                idZespolRealizacyjny:idZR,
                listaDatRR:[moment(new Date()).format()]
            }
        }, {upsert: true});
    },

    updStatDateVotingIssue: function (id, status, dataGlosowania) {
        return Kwestia.update(id, {
            $set: {
                status: status,
                dataGlosowania: dataGlosowania
            }
        }, {upsert: true});
    },

    updStatDateVotingIssueFinal: function (id, status, dataGlosowania, start) {
        return Kwestia.update(id, {
            $set: {
                status: status,
                dataGlosowania: dataGlosowania,
                startGlosowania: start
            }
        }, {upsert: true});
    },

    removeIssue: function (id) {
        return Kwestia.update(id,{$set: {czyAktywny: false}}, {upsert: true});
    },

    removeIssueSetReason: function (id,reason) {
        return Kwestia.update(id,{$set: {czyAktywny: false, reason:reason}}, {upsert: true});
    },

    removeIssueSetReasonAnswer: function (id,reason,answer) {
        return Kwestia.update(id,{$set: {czyAktywny: false, reason:reason,isAnswerPositive:answer}}, {upsert: true});
    },

    // This function is probably not used. Make sure it is potentially useful
    setAnswerKwestiaOczekujaca: function (id,answer) {
        return Kwestia.update(id,{$set: {isAnswerPositive:answer}}, {upsert: true});
    },

    setAnswerWaitIssueNrResolDateOfImpl: function (id,answer,nrUch,dataRealizacji) {
        return Kwestia.update(id,{$set: {isAnswerPositive:answer,numerUchwaly:nrUch,dataRealizacji:dataRealizacji}}, {upsert: true});
    },

    // This function is probably not used. Make sure it is potentially useful
    updateStatIdZespolu: function (id,status,idZR) {
        return Kwestia.update(id, {
            $set: {
                status: status,
                idZespolRealizacyjny:idZR
            }
        }, {upsert: true});
    },

    // This function is probably not used. Make sure it is potentially useful
    updateStatusDataOczekwianiaKwestii: function (id, status,dataOczekiwania) {
        return Kwestia.update(id, {$set: {status: status, dataRozpoczeciaOczekiwania:dataOczekiwania}}, {upsert: true});
    },

    addConstZR: function (id,zespol) {
        return Kwestia.update(id, {$set: {zespol: zespol}});
    },

    updTheLobbTimeIssue: function (id,lobbowana) {
        return Kwestia.update(id, {$set: {lobbowana:lobbowana}});
    },

    updateReportsIssue: function (id,reports) {
        return Kwestia.update(id, {$set: {raporty:reports}});
    },

    updateDeadlineNextRR: function (id,checkArrayRR) {
        return Kwestia.update(id, {$set: {listaDatRR:checkArrayRR}});
    },

    setIssueProblemSendingEmail: function (id,emailProblem) {
        return Kwestia.update(id, {$set: {emailProblemNotification:emailProblem}});
    }
});
