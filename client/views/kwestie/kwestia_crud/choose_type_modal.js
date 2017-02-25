/**
 * Created by Bartłomiej Szewczyk on 2015-11-23.
 */
Template.chooseTypeModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {
                    key: 'nazwaRodzaj',
                    label: TXV.NAME
                },
                {
                    key: '_id',
                    label: "",
                    tmpl: Template.typeName
                }
            ]
        };
    },
    TypeList: function(){
        var topicName = Session.get("choosenTopic");
        var topic = Temat.findOne({nazwaTemat: topicName});
        var topicId = null;
        if (topic != null)
            topicId = topic._id;
        return Rodzaj.find({idTemat: topicId});
    }
});

Template.typeName.events({
    'click #chosenTypeBtn': function() {
        Session.setPersistent("choosenType", this.nazwaRodzaj);
        $("#chooseTypeModalId").modal("hide");
    }
});