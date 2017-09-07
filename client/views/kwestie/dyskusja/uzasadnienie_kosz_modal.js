Template.uzasadnienieKoszModal.rendered = function () {
    document.getElementById('zatwierdzPrzeniesDoKosza').disabled = false;
};
Template.uzasadnienieKoszModal.events({
    'click #zatwierdzPrzeniesDoKosza': function (e) {
        e.preventDefault();
        var uzasadnienie = document.getElementById('uzasadnienieKosz').value;
        if (uzasadnienie) {
            if (uzasadnienie.trim() != '') {
                document.getElementById('zatwierdzPrzeniesDoKosza').disabled = true;
                var message = TAPi18n.__('txv.MOVE_TO_TRASH');
                var idKwestia = this.idKwestia;
                var idUser = Meteor.userId();
                var addDate = new Date();
                var isParent = true;
                var idParent = null;
                var czyAktywny = true;
                var userFullName = Meteor.user().profile.fullName;
                var ratingValue = 0;
                var glosujacy = [];
                var postType = POSTS_TYPES.KOSZ;

                var post = [{
                    idKwestia: idKwestia,
                    wiadomosc: message,
                    idUser: idUser,
                    uzasadnienie: uzasadnienie,
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
                if (isNotEmpty(post[0].idKwestia, '') && isNotEmpty(post[0].wiadomosc, 'komentarz') && isNotEmpty(post[0].idUser, '') &&
                    isNotEmpty(post[0].addDate.toString(), '') && isNotEmpty(post[0].czyAktywny.toString(), '') &&
                    isNotEmpty(post[0].userFullName, '' && isNotEmpty(post[0].isParent.toString(), ''))) {

                    var z = Posts.findOne({idKwestia: idKwestia, postType: POSTS_TYPES.KOSZ});

                    if (!z) {
                        Meteor.call('addPost', post, function (error, ret) {
                            if (error) {
                                if (typeof Errors === 'undefined')
                                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                                else {
                                    throwError(error.reason);
                                }
                            } else {
                                var postId = ret;
                                var z2 = Posts.find({idKwestia: idKwestia, postType: POSTS_TYPES.KOSZ});
                                if (z2.count() <= 1) {
                                    document.getElementById('message').value = '';
                                    $('#uzasadnijWyborKosz').modal('hide');
                                    $('html, body').animate({
                                        scrollTop: $('.doKoszaClass').offset().top
                                    }, 600);
                                } else {
                                    document.getElementById('message').value = '';
                                    $('#uzasadnijWyborKosz').modal('hide');
                                    Meteor.call('removePost',postId,function (error,ret) {
                                        if (!error) {
                                            $('html, body').animate({
                                                scrollTop: $('.uzasadnijWyborKosz').offset().top
                                            }, 600);
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        document.getElementById('message').value = '';
                        $('#uzasadnijWyborKosz').modal('hide');
                        $('html, body').animate({
                            scrollTop: $('.doKoszaClass').offset().top
                        }, 600);
                    }
                }
            }
        }
    },
    'click #cancelButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieKosz').value = '';
        $('#uzasadnijWyborKosz').modal('hide');
    }
});
