Template.zrModalCurrentIssueMyResolutionsInner.rendered=function(){
    document.getElementById("agreeButton").disabled=false;
};

Template.zrModalCurrentIssueMyResolutionsInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 5,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'numerUchwaly', label: TXV.RESOLUTION_NO},
                {key: 'kwestiaNazwa', label: TXV.NAME_OF_ISSUES},
                {key: 'dataRealizacji', label: TXV.REALIZ_DATE, tmpl: Template.dataRealizKwestia}
            ]
        };
    },
    IssuesList: function(){
        var zr = ZespolRealizacyjny.findOne({_id: this.idZespolRealizacyjny});
        var issues = Kwestia.find({_id: {$in: zr.kwestie}, czyAktywny: true});
        return issues;
    }
});

Template.zrModalCurrentIssueMyResolutionsInner.events({
    'click #agreeButton':function(e){
        e.preventDefault();
        document.getElementById("agreeButton").disabled=true;
        $("#zrCurrentIssueMyResolutions").modal("hide");


        var zr=ZespolRealizacyjny.findOne({_id:this.idZespolRealizacyjny});
        var currentIssueId=Router.current().params._id;
        var zespol= _.without(zr.zespol,Meteor.userId());
        Meteor.call("updateCzlonkowieZR",zr._id,zespol,function(error){//to FINISH
            if(error)
                throwError(error.reason);
            else{
                var zrList=ZespolRealizacyjnyDraft.find({idZR:zr._id});
                var array=[];
                zrList.forEach(function(zr){
                    array.push(zr._id);
                });
                var allIssues=Kwestia.find({
                    czyAktywny:true,
                    status:{$in:[
                        KWESTIA_STATUS.GLOSOWANA,
                        KWESTIA_STATUS.OSOBOWA,
                        KWESTIA_STATUS.OCZEKUJACA,
                        KWESTIA_STATUS.DELIBEROWANA]},
                    _id:{$nin:[currentIssueId]},
                    idZespolRealizacyjny:{$in:array}
                });
                if(allIssues.count()>0){
                    var newZRList=[];
                    allIssues.forEach(function(issue){
                        newZRList.push(issue.idZespolRealizacyjny);
                    });
                    var zrCur=ZespolRealizacyjnyDraft.find({_id:{$in:newZRList}});
                    zrCur.forEach(function(zrItem){
                       Meteor.call("updateCzlonkowieNazwaZRDraft",zrItem._id,zespol,zr.nazwa);
                    });
                }
                document.getElementById("agreeButton").disabled=false;
            }
        });
    }
});

manageIssuesWithoutZR=function(issuesArray){
    var issues=Kwestia.find({_id:{$in:issuesArray},status:{$in:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.REALIZOWANA]}});
    issues.forEach(function(issue){
        Meteor.call("removeKwestia",issue._id,function(error){
           if(!error){

           }
        });
    });
};

withdrawalIssueChanges=function(issue){
    if(issue.typ=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){
        restoratePreviousParameters(issue);
    }
    if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],issue.typ)){
        var userDraft=UsersDraft.findOne({_id:issue.idUser});
        if(userDraft.idUser){

        }
        else{

        }
    }
};

restoratePreviousParameters=function(issue){

};