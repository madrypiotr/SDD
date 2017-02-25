isUserInZespolRealizacyjnyNotification=function(id,zespolTab){
    if(_.contains(zespolTab,id)){
        GlobalNotification.error({
            title: 'Błąd',
            content: 'Jesteś już w tym ZR.',
            duration: 10 // duration the notification should stay in seconds
        });
        return true;
    }
    else
        return false;
};
isUserCountInZespolRealizacyjnyNotification=function(id,zespolTab,numberOfCzlonkowie){
    if(zespolTab.length==3) {
        var komunikat='Jest już '+numberOfCzlonkowie+' członków ZR';
        GlobalNotification.error({
            title: 'Błąd',
            content: komunikat,
            duration: 10 // duration the notification should stay in seconds
        });
        return true;
    }
    return false;
};
addCzlonekToZespolRealizacyjnyNotification=function(idUser,zespolToUpdate,numberOfCzlonkowie,zespolId){

    if(zespolToUpdate.length==2) {
        //sprawdzam czy mamy taki zespol z idącym kolejnym członkiem
        zespolToUpdate.push(idUser);
        var kwestie = Kwestia.find({
            $where: function () {
                return (this.status==KWESTIA_STATUS.GLOSOWANA || this.status==KWESTIA_STATUS.ARCHIWALNA);
            }
        });
        var flag=false;
        var arrayZespolyDouble=[];
        kwestie.forEach(function(kwestia){//odnajdujemy zespoly
            var zespol=ZespolRealizacyjny.findOne({_id:kwestia.idZespolRealizacyjny});
            if(zespol){
                var i=0;
                _.each(zespol.zespol, function (zespolItem) {//dla kazdej aktualnego item z aktualnego zepsolu

                    if (_.contains(zespolToUpdate, zespolItem)) {//jezeli z bazy tablica zawiera ten z zespołu
                        i++;
                    }
                });
                if (i == zespol.zespol.length) {
                    arrayZespolyDouble.push(zespol._id);
                    flag = true;
                    //moze sie zdarzyc,ze bd kilka zespołów o tych samym składzie,więc dajmy je do tablicy!
                }
            }
        });
        if(flag==true){
            Session.setPersistent("zespolRealizacyjnyDouble", arrayZespolyDouble);
            $("#decyzjaModalId").modal("show");
        }

        else {//to znaczy,ze normalnie mnie dodają do bazy
            komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego. Mamy już komplet';
            $("#addNazwa").modal("show");

            GlobalNotification.success({
                title: 'Sukces',
                content: komunikat,
                duration: 10 // duration the notification should stay in seconds
            });
            return true;
        }
    }
    else{
        var text = null;
        if (numberOfCzlonkowie == 0)
            text = ' członków';
        else
            text = ' członka';
        var komunikat = 'Zostałeś/ dodany do Zespołu Realizacyjnego. Potrzeba jeszcze ' + numberOfCzlonkowie + text;

        zespolToUpdate.push(idUser);
        Meteor.call('updateCzlonkowieZR', zespolId, zespolToUpdate, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else{
                GlobalNotification.success({
                    title: 'Sukces',
                    content: komunikat,
                    duration: 10 // duration the notification should stay in seconds
                });
                return true;
            }
        });

    }


};
bladNotification=function(){
    GlobalNotification.error({
        title: 'UWAGA',
        content: 'Wystąpił błąd.',
        duration: 10 // duration the notification should stay in seconds
    });
};

isUserInZRNotification=function(idZespolu){
    var zespol=ZespolRealizacyjny.findOne({_id:idZespolu});
    if(zespol) {
        if (!_.contains(zespol.zespol, Meteor.userId())) {
            GlobalNotification.error({
                title: 'Uwaga',
                content: 'Niestety, decyzję o realizowaniu tej Kwestii może podjąć jedynie członek zespołu. Poproś jednego z nich, aby przyjął realizację, wybierz inny Zespół, lub stwórz nowy. ',
                duration: 10 // duration the notification should stay in seconds
            });
            return true;
        }
        else return false;
    }
    return false;
};

addCzlonekToZespolRealizacyjnyNotificationNew=function(idUser,zespolToUpdate,numberOfCzlonkowie,zespolId){

    if(zespolToUpdate.length==2) {
        //sprawdzam czy mamy taki zespol z idącym kolejnym członkiem,szukamy w ZR
        zespolToUpdate.push(idUser);

        var flag=false;
        var arrayZespolyDouble=[];
        var zespoly=ZespolRealizacyjny.find({czyAktywny:true});
        if(zespoly){
            zespoly.forEach(function(zespol) {
                var i = 0;
                _.each(zespol.zespol, function (zespolItem) {//dla kazdej aktualnego item z aktualnego zepsolu

                    if (_.contains(zespolToUpdate, zespolItem)) {//jezeli z bazy tablica zawiera ten z zespołu
                        i++;
                    }
                });
                if (i == zespol.zespol.length) {
                    arrayZespolyDouble.push(zespol._id);
                    flag = true;
                }
            });
        }

        if(flag==true){//są takowe, więc wyświtlamy
            Session.setPersistent("zespolRealizacyjnyDouble", arrayZespolyDouble);
            $("#decyzjaModalId").modal("show");
        }
        //nie ma tekiego w bazie,więc sobie uzupelniamy drafta.to finish
        else {
            $("#addNazwa").modal("show");

            //GlobalNotification.success({
            //    title: 'Sukces',
            //    content: komunikat,
            //    duration: 10 // duration the notification should stay in seconds
            //});
            return true;
        }
    }
    else{
        var text = null;
        if (numberOfCzlonkowie == 0 || numberOfCzlonkowie==2)
            text = ' członków';
        else
            text = ' członka';
        var komunikat = 'Zostałeś dodany do Zespołu Realizacyjnego. Potrzeba jeszcze ' + numberOfCzlonkowie + text;

        zespolToUpdate.push(idUser);
        Meteor.call('updateCzlonkowieZRDraft', zespolId, zespolToUpdate, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else{
                GlobalNotification.success({
                    title: 'Sukces',
                    content: komunikat,
                    duration: 10 // duration the notification should stay in seconds
                });
                return true;
            }
        });

    }


};

//FUNKCJE
getCzlonekFullName=function(number,idZR,ZRType){
    var userID=getZRData(number,idZR,ZRType);
    if(userID){
        var user = Users.findOne({_id: userID});
        if(user.profile) {
            return user.profile.fullName;
        }
    }
};
getZRData=function(number,idZR,ZRType){
    var z=null;
    if(ZRType=="ZRDraft")
        z = ZespolRealizacyjnyDraft.findOne({_id: idZR});
    else
        z = ZespolRealizacyjny.findOne({_id: idZR});
    if(z){
        zespolId = z._id;
        var zespol = z.zespol;
        if(zespol){
            var id = zespol[number];
            return id ? id :null;
        }
    }
};
checkIfInZR=function(idZR,idMember){
    var z = ZespolRealizacyjnyDraft.findOne({_id: idZR});
    if(z){
        return _.contains(z.zespol,idMember) ? idMember :null;
    }
},
rezygnujZRAlert=function(idUserZR,idKwestia){
    bootbox.dialog({
        title: "Jesteś członkiem tego Zespołu Roboczego dla koordynowania realizacji Kwestii.",
        message:"Możesz zrezygnować lub w nim pozostać",
        buttons: {
            success: {
                label: "Rezygnuję",
                className: "btn-success successGiveUp",
                callback: function() {
                    $('.successGiveUp').css("visibility", "hidden");
                    rezygnujZRFunction(idUserZR,idKwestia);
                }
            },
            main: {
                label: "Pozostaję",
                className: "btn-primary"
            }
        }
    });
};
rezygnujZRFunction=function(idUserZR,idKwestia){

    var kwestia=Kwestia.findOne({_id:idKwestia});
    if(kwestia) {
        var zespol=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
        if(zespol) {
            var zespolR = zespol.zespol.slice();
            zespolR= _.without(zespolR,Meteor.userId());
            var ZRDraft= {
                nazwa: "",
                "zespol": zespolR,
                "idZR": null
            };
            $('.successGiveUp').css("visibility", "visible");
            Meteor.call('updateZespolRealizacyjnyDraft', zespol._id, ZRDraft, function (error) {
                if (error) {
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
            });
        }
    }
};
