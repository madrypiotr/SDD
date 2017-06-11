Template.uzasadnienieArchiwumModal.rendered=function(){
    document.getElementById("zatwierdzPrzeniesDoArchiwum").disabled = false;
};
Template.uzasadnienieArchiwumModal.events({
    'click #zatwierdzPrzeniesDoArchiwum': function (e) {
        e.preventDefault();
        var uzasadnienie = document.getElementById('uzasadnienieArchiwum').value;
        if (uzasadnienie) {
            if(uzasadnienie.trim()!="") {
                document.getElementById("zatwierdzPrzeniesDoArchiwum").disabled = true;

                var message = TXV.MOVE_TO_ARCH;
                var idKwestia = this.idKwestia;
                var idUser = Meteor.userId();
                var addDate = new Date();
                var isParent = true;
                var idParent = null;
                var czyAktywny = true;
                var userFullName = Meteor.user().profile.fullName;
                var ratingValue = 0;
                var glosujacy = [];
                var postType = POSTS_TYPES.ARCHIWUM;

                var post = [{
                    idKwestia: idKwestia,
                    wiadomosc: message,
                    uzasadnienie: uzasadnienie,
                    idUser: idUser,
                    userFullName: userFullName,
                    addDate: addDate,
                    isParent: isParent,
                    idParent: idParent,
                    czyAktywny: czyAktywny,
                    idParent: idParent,
                    wartoscPriorytetu: ratingValue,
                    glosujacy: glosujacy,
                    postType: postType
                }];
                var z = Posts.findOne({idKwestia: idKwestia, postType: POSTS_TYPES.ARCHIWUM});

                if(!z) {
                    Meteor.call('addPost', post, function (error, ret) {
                        if (error) {
                            if (typeof Errors === "undefined")
                                Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                            else {
                                throwError(error.reason);
                            }
                        }
                        else {
                            var postId=ret;
                            var z2 = Posts.find({idKwestia: idKwestia, postType: POSTS_TYPES.ARCHIWUM});
                            if(z2.count()<=1) {
                                var newValue = 0;
                                newValue = Number(RADKING.DODANIE_ODNIESIENIA) + getUserRadkingValue(Meteor.userId());
                                Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                                    if (error) {
                                        if (typeof Errors === "undefined")
                                            Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                                        else
                                            throwError(error.reason);
                                    }
                                });
                                document.getElementById("message").value = "";
                                $("#uzasadnijWyborArchiwum").modal("hide");
                                $('html, body').animate({
                                    scrollTop: $(".doArchiwumClass").offset().top
                                }, 600);
                            }
                            else{
                                document.getElementById("message").value = "";
                                $("#uzasadnijWyborArchiwum").modal("hide");
                                Meteor.call("removePost",postId,function(error,ret){
                                    if(!error) {
                                        $('html, body').animate({
                                            scrollTop: $(".doArchiwumClass").offset().top
                                        }, 600);
                                    }
                                });
                            }
                        }
                    });
                }
                else{
                    document.getElementById("message").value = "";
                    $("#uzasadnijWyborArchiwum").modal("hide");
                    $('html, body').animate({
                        scrollTop: $(".doArchiwumClass").offset().top
                    }, 600);
                }
            }
        }
    },
    'click #anulujButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieArchiwum').value = "";
        $("#uzasadnijWyborArchiwum").modal("hide");
    }
});
