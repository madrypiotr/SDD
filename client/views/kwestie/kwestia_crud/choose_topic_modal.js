/**
 * Created by Bartłomiej Szewczyk on 2015-11-23.
 */
Template.chooseTopicModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 5,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'nazwaTemat',
                    label: TAPi18n.__('txv.NAME')
                },
                {
                    key: 'opis',
                    label: TAPi18n.__('txv.DESCRIPTION')
                },
                {
                    key: '_id',
                    label: "",
                    tmpl: Template.topicName
                }
            ]
        };
    },
    TopicList: function(){
            return Temat.find({});
    }
});

Template.topicName.events({
    'click #choosenTopicBtn': function() {
        Session.setPersistent("choosenTopic", this.nazwaTemat);
        Session.setPersistent("choosenType", null);
        if(Rodzaj.find({idTemat: this._id}).count()>0) {
            document.getElementById("chooseTypeBtn").disabled = false;
        }else{
            document.getElementById("chooseTypeBtn").disabled = true;
        }
        document.getElementById("addTypeBtn").disabled = false;
        $("#chooseTopicModalId").modal("hide");
    }
});
