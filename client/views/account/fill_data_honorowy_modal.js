Template.fillDataHonorowyModal.events({
    'click #addFields': function (e) {
        e.preventDefault();

        var firstName = $('#firstName').val();
        var lastName=$('#lastName').val();
        var city=$('#city').val();
        if(firstName.trim()!='' && lastName.trim()!='' && city.trim()!=''){
            $("#fillDataHonorowy").modal("hide");
            addNewUser(firstName,lastName,city,email,kwestia);
        }
        else{
            GlobalNotification.error({
                title: TXV.ERROR,
                content: TXV.DO_NOT_EMPTY,
                duration: 4 // duration the notification should stay in seconds
            });
        }
    },
    'click #anulujButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieKosz').value = "";
        $("#fillDataHonorowy").modal("hide");
    }
});