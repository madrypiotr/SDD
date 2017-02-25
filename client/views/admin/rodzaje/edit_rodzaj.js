Template.editRodzajForm.rendered = function () {
    $("#rodzajForm").validate({
        rules: {
            czasDyskusji: {
                min: 1
            },
            czasGlosowania: {
                min: 0.01,
                number: true
            }
        },
        messages: {
            nazwaRodzaj: {
                required: fieldEmptyMessage(),
            },
            tematy: {
                required: fieldEmptyMessage()
            },
            czasDyskusji: {
                min: positiveNumberMessage()
            },
            czasGlosowania: {
                min: positiveNumberMessage(),
                number: decimalNumberMessage()
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
    })
};

Template.editRodzajForm.helpers({
    kworumList: function(){
        return [
            {index: 0, value: "zwykla", name: "Kwestia zwykla"},
            {index: 1, value: "statutowa", name: "Kwestia statutowa"}
        ]
    },
    tematToList: function () {
        return Temat.find({});
    },
    isSelected: function (id) {
        var self = Template.instance();
        var item = Rodzaj.findOne({_id: self.data._id});
        if (item.idTemat == id)
            return true;
        else
            return false;
    },
    isSelectedKworum: function (k) {
        var item = Rodzaj.findOne({_id: Template.instance().data._id});
        var kworum = item.kworum;
        if(kworum == k)
            return true;
        else
            return false;
    }
});

Template.editRodzajForm.events({
    'submit form': function (e) {
        e.preventDefault();

        var idRodzaj = this._id;
        var czasD = $(e.target).find('[name=czasDyskusji]').val();
        if (czasD == '' || czasD == '0')
            czasD = 7;
        var czasG = $(e.target).find('[name=czasGlosowania]').val().replace(/\s+/g, '');
        if (czasG == '' || czasG == '0')
            czasG = 24;

        var rodzaj = {
            idTemat: $(e.target).find('[name=tematy]').val(),
            nazwaRodzaj: $(e.target).find('[name=nazwaRodzaj]').val(),
            czasDyskusji: czasD,
            czasGlosowania: czasG,
            kworum: $(e.target).find('[name=kworumSelect]').val()
        };
        Meteor.call('updateRodzaj', idRodzaj, rodzaj, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            } else {
                Router.go('listTemat');
            }
        });
    },
    'reset form': function () {
        Router.go('listTemat');
    }
});