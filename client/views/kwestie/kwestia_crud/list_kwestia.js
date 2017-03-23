
Template.listKwestia.rendered = function () {
    var self = Template.instance();
    this.autorun(function () {
        var kwestie = Kwestia.find({
            $where: function () {
                var typKworum=liczenieKworumZwykle();
                if(this.idRodzaj){
                    var rodzaj=Rodzaj.findOne({_id:this.idRodzaj});
                    if(rodzaj) {
                        if (rodzaj.nazwaRodzaj.trim() == "Statutowe")
                            typKworum = liczenieKworumStatutowe();
                    }
                }
                var zrCondition=true;
                if(this.idZespolRealizacyjny){
                    var zrDraft=ZespolRealizacyjnyDraft.findOne({_id:this.idZespolRealizacyjny});
                    if(zrDraft){
                        if(zrDraft.zespol.length>=3)
                            zrCondition=true;
                        else
                            zrCondition=false;
                    }
                    else
                        zrCondition=false;
                }
                return ((this.czyAktywny == true) &&
                (this.wartoscPriorytetu > 0) &&
                (this.glosujacy.length>=typKworum) && zrCondition==true
                &&(this.status==KWESTIA_STATUS.DELIBEROWANA || this.status==KWESTIA_STATUS.ADMINISTROWANA || this.status==KWESTIA_STATUS.OSOBOWA));
            }
        }, {sort: {wartoscPriorytetu: -1,dataWprowadzenia:1}});//, limit: 3});
        var tab = [];
        if(kwestie.count()<=3) {
            kwestie.forEach(function (item) {
                tab.push(item._id);
            });
        }
        else {
            tab=setInQueueToVoteMethod(kwestie);
        }
        self.liczbaKwestiRV.set(tab);
    });
};

Template.listKwestia.created = function () {
    this.liczbaKwestiRV = new ReactiveVar();
    this.choosenSortRV = new ReactiveVar();
    this.choosenSortRV.set(0);
};

Template.listKwestia.events({
    'click #addKwestiaButton': function () {
        var kwestiaCanBeInserted=kwestiaIsAllowedToInsert();
        if(kwestiaCanBeInserted==true) {
            if (!!Session.get("kwestiaPreview"))
                Session.set("kwestiaPreview", null);
            Router.go("addKwestia");
        }
        else
            notificationPauseWarning("kwestii",kwestiaCanBeInserted);
    },
    "change #customFilterSelect": function (event, template) {
        var input = $(event.target).val();
        var self = Template.instance();
        if (!!input && input==0)
            self.choosenSortRV.set(0);
         else
            self.choosenSortRV.set(1);
    }
});

Template.listKwestia.helpers({
    'isDataSortEnabled':function(){
        var self = Template.instance();
        var sort = self.choosenSortRV.get();
        return sort==0 ? true : false;
    },
    'getFilterFields':function(){
        return ['kwestiaNazwa'];
    },
    'settings': function () {
        var self = Template.instance();
        var sort = self.choosenSortRV.get();
        return {
            currentPage:Template.instance().currentPage,
            rowsPerPage: 20,
            showNavigationRowsPerPage:true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            noDataTemplate:Template.noData,
            filters:['customFilter'],
            fields: [
                { key: 'dataWprowadzenia', label: TXV.DATA, tmpl: Template.dataUtwKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'kwestiaNazwa', label: TXV.NAME_OF_ISSUES, tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TXV.PRIORITY, tmpl: Template.priorytetKwestia },
                { key: 'idTemat', label: TXV.SUBJECT, tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: TXV.TYPE, tmpl: Template.rodzajKwestia },
                { key: 'Kworum', label: TXV.QUORUM, tmpl: Template.kworumNumber}
            ],
            rowClass: function (item) {
                tab = self.liczbaKwestiRV.get();
                if (_.contains(tab, item._id)) {
                    return 'priorityClass';
                }
            }
        };
    },
    'settings2': function () {
        var self = Template.instance();
        var sort = self.choosenSortRV.get();
        return {
            rowsPerPage: 20,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            noDataTemplate: Template.noData,
            filters: ['customFilter'],
            fields: [
                { key: 'dataWprowadzenia', label: TXV.DATA, tmpl: Template.dataUtwKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'kwestiaNazwa', label: TXV.NAME_OF_ISSUES, tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TXV.PRIORITY, tmpl: Template.priorytetKwestia },
                { key: 'idTemat', label: TXV.SUBJECT, tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: TXV.TYPE, tmpl: Template.rodzajKwestia },
                { key: 'Kworum', label: TXV.QUORUM, tmpl: Template.kworumNumber}
            ],
            rowClass: function (item) {
                tab = self.liczbaKwestiRV.get();
                if (_.contains(tab, item._id)) {
                    return 'priorityClass';
                }
            }
        };
    },
    KwestiaList: function () {
        var kwestie = Kwestia.find({
            $where: function () {
                return ((this.czyAktywny == true)&&
                ((this.status==KWESTIA_STATUS.DELIBEROWANA)  ||
                (this.status==KWESTIA_STATUS.ADMINISTROWANA) ||
                (this.status==KWESTIA_STATUS.OSOBOWA) ||
                (this.status==KWESTIA_STATUS.OCZEKUJACA)));
            }
        });

        if(kwestie)
            return kwestie;
        else
            return null;
    },
    isAdminUser: function () {
        return IsAdminUser();
    }
});

Template.dataUtwKwestia.helpers({
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm:ss");
    }
});
Template.id.helpers({
    id: function () {
        return this._id;
    }
});

Template.priorytetKwestia.helpers({
    priorytet: function () {
        var p = this.wartoscPriorytetu;
        if (p) {
            if (p > 0) p = " +" + p;
            return p ;
        }
        else return 0 ;
    },
    myGlos:function(){
        var glosy = this.glosujacy.slice();
        var myGlos;
        _.each(glosy, function (glos) {
            if (glos.idUser == Meteor.userId()) {
                myGlos = glos.value;
            }
        });
        if (myGlos) {
            if (myGlos > 0) myGlos = "+" + myGlos;
        }
        else
            myGlos = 0;
        return " (" + myGlos+")";
    },
    nadanyPriorytet:function(){
        if(Meteor.userId())
            return _.contains(_.pluck(this.glosujacy,'idUser'),Meteor.userId()) ? true : false;
    }
});

Template.listKwestiaColumnLabel.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};

Template.listKwestia.helpers({
    isZwyczajnyLogged:function(){
        if(IsAdminUser())
            return false;
        else {
            return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
        }
    }
});

Template.kworumNumber.helpers({
    'getKworum':function(){
        return " /" +liczenieKworumZwykle();
    },
    'getUsersCount':function(){
        var usersCount = this.glosujacy.length;
        return usersCount.toString();
    }
});
kwestiaIsAllowedToInsert=function(){
    var myKwestie=Kwestia.find({idUser:Meteor.userId()},{sort:{dataWprowadzenia:1}});
    if(myKwestie.count()>0){
        var array=[];
        myKwestie.forEach(function(kwestia){
            array.push(kwestia);
        });
        array=(_.sortBy(array,'dataWprowadzenia')).reverse();
        var lastAddedIssueTime= (_.first(array)).dataWprowadzenia;
        var params=Parametr.findOne();
        if(params) {
            return checkTimePause(params.addIssuePause, lastAddedIssueTime);
        }
    }
    else return true;
};

checkTimePause=function(typePause,lastAddedTime){
    var newTimeToAdd=moment(lastAddedTime).add(typePause,"minutes").format();
    if(newTimeToAdd > moment(new Date()).format()){
        var ms = moment(newTimeToAdd,"DD/MM/YYYY HH:mm:ss").diff(moment(new Date(),"DD/MM/YYYY HH:mm:ss"));
        var s = moment.utc(ms).format("mm:ss");
        var timeString= s.substring(0, s.indexOf(":"))+ TXV.MIN+s.substring(s.indexOf(":")+1, s.length)+ TXV.SEC;
        return timeString ;
    }
    else
        return true;
};

Template.nazwaKwestiLink.helpers({
    'issueName': function(){
        if(this.kwestiaNazwa.length>60){
            return this.kwestiaNazwa.substr(0,60)+"...";
        }else{
            return this.kwestiaNazwa
        }
    }
});

Template.tematKwestia.helpers({
    'topicName': function(){
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){
            return TXV.BELONGS_TO_THE_SYSTEM;
        }
        var topic = Temat.findOne({_id: this.idTemat}).nazwaTemat;
        if(topic.length>20){
            return topic.substr(0,20)+"...";
        }else{
            return topic
        }
    }
});
Template.rodzajKwestia.helpers({
    'typeName': function(){
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){
            return TXV.TECHNICAL;
        }
        var type = Rodzaj.findOne({_id: this.idRodzaj}).nazwaRodzaj;
        if(type.length>20){
            return type.substr(0,20)+"...";
        }else{
            return type
        }
    }
});
