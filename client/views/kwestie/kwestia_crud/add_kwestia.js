Template.addKwestiaForm.rendered = function () {

    Session.setPersistent('choosenTopic', null);
    Session.setPersistent('choosenType', null);
    document.getElementById('sugerowanyTemat').readOnly = true;
    document.getElementById('sugerowanyRodzaj').readOnly = true;
    document.getElementById('chooseTypeBtn').disabled = true;
    document.getElementById('addTypeBtn').disabled = true;

    $('#kwestiaForm').validate({
        rules: {
            kwestiaNazwa: {
                checkExistsNazwaKwestii: true,
                maxlength: 80
            },
            krotkaTresc: {
                maxlength: 400
            },
            szczegolowaTresc: {
                maxlength: 1000
            }
        },
        messages: {
            sugerowanyTemat:{
                required:fieldEmptyMessage()
            },
            sugerowanyRodzaj:{
                required:fieldEmptyMessage()
            },
            kwestiaNazwa: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(80)
            },
            krotkaTresc: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(400)
            },
            szczegolowaTresc: {
                required: fieldEmptyMessage(),
                maxlength: maxLengthMessage(1000)
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    });
};

Template.addKwestiaForm.helpers({
    topic: function () {
        return Session.get('choosenTopic');
    },
    type: function () {
        return Session.get('choosenType');
    }
});

Template.addKwestiaForm.events({
    'submit #kwestiaForm': function (e) {
        e.preventDefault();

        var topicValue = $(e.target).find('[id=sugerowanyTemat]').val();
        var typeValue = $(e.target).find('[id=sugerowanyRodzaj]').val();
        if(topicValue == null || topicValue == '' || typeValue == null || typeValue == ''){
            GlobalNotification.error({
                title: TAPi18n.__('txv.WARNING'),
                content: TAPi18n.__('txv.FILL_SUBJ_AND_TYPE'),
                duration: 4 // duration the notification should stay in seconds
            });

        }else{
            var newKwestia = [
                {
                    idUser: Meteor.userId(),
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: $(e.target).find('[name=kwestiaNazwa]').val(),
                    wartoscPriorytetu: 20,
                    temat: Session.get('choosenTopic'),
                    rodzaj: Session.get('choosenType'),
                    krotkaTresc: $(e.target).find('[name=krotkaTresc]').val(),
                    szczegolowaTresc: $(e.target).find('[name=szczegolowaTresc]').val(),
                    isOption: false,
                    typ: KWESTIA_TYPE.BASIC
                }];

            Session.setPersistent('kwestiaPreview', newKwestia[0]);
            Router.go('previewKwestia');
        }
    },
    'reset form': function () {
        Router.go('listKwestia');
    },
    'click #chooseTopicBtn': function () {
        $('#chooseTopicModalId').modal('show');
    },
    'click #addTopicBtn': function () {
        $('#addTopicModalId').modal('show');
    },
    'click #chooseTypeBtn': function () {
        $('#chooseTypeModalId').modal('show');
    },
    'click #addTypeBtn': function () {
        $('#addTypeModalId').modal('show');
    }
});
