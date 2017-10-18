Template.uzasadnienieZrealizowanoModal.rendered = function () {
    document.getElementById('zatwierdzPrzeniesDoZrealizowanych').disabled = false;
};
Template.uzasadnienieZrealizowanoModal.events({
    'click #zatwierdzPrzeniesDoZrealizowanych': function (e) {
        const user = Meteor.user();
        e.preventDefault();
        var uzasadnienie = document.getElementById('uzasadnienieZrealizowano').value;
        if (uzasadnienie) {
            if (uzasadnienie.trim() != '') {
                document.getElementById('zatwierdzPrzeniesDoZrealizowanych').disabled = true;
                var message = TAPi18n.__('txv.MOVE_TO_COMPLETED');
                var idKwestia = this.idKwestia;
                var idUser = Meteor.userId();
                var addDate = new Date();
                var isParent = true;
                var idParent = null;
                var czyAktywny = true;
                var userFullName = user && user.profile.fullName;
                var ratingValue = 0;
                var glosujacy = [];
                var postType = POSTS_TYPES.ZREALIZOWANA;

                var post = [{
                    addDate: addDate,
                    czyAktywny: czyAktywny,
                    glosujacy: glosujacy,
                    idKwestia: idKwestia,
                    idParent: idParent,
                    idUser: idUser,
                    isParent: isParent,
                    postType: postType,
                    userFullName: userFullName,
                    uzasadnienie: uzasadnienie,
                    wartoscPriorytetu: ratingValue,
                    wiadomosc: message
                }];
                if (isNotEmpty(post[0].idKwestia, '') &&
                    isNotEmpty(post[0].wiadomosc, 'komentarz') &&
                    isNotEmpty(post[0].idUser, '') &&
                    isNotEmpty(post[0].addDate.toString(), '') &&
                    isNotEmpty(post[0].czyAktywny.toString(), '') &&
                    isNotEmpty(post[0].userFullName, '' &&
                    isNotEmpty(post[0].isParent.toString(), ''))
                ) {
                    const z = Posts.findOne({idKwestia: idKwestia, postType: POSTS_TYPES.ZREALIZOWANA});

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
                                var z2 = Posts.find({idKwestia: idKwestia, postType: POSTS_TYPES.ZREALIZOWANA});
                                if (z2.count() <= 1) {
                                    document.getElementById('message').value = '';
                                    $('#uzasadnijWyborZrealizowano').modal('hide');
                                    $('html, body').animate({
                                        scrollTop: $('.doZrealizowanychClass').offset().top
                                    }, 600);
                                } else {
                                    document.getElementById('message').value = '';
                                    $('#uzasadnijWyborZrealizowano').modal('hide');
                                    Meteor.call('removePost', postId, function (error) {
                                        if (!error) {
                                            $('html, body').animate({
                                                scrollTop: $('.uzasadnijWyborZrealizowano').offset().top
                                            }, 600);
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        document.getElementById('message').value = '';
                        $('#uzasadnijWyborZrealizowano').modal('hide');
                        $('html, body').animate({
                            scrollTop: $('.doZrealizowanychClass').offset().top
                        }, 600);
                    }
                }
            }
        }
    },
    'click #cancelButton': function (e) {
        e.preventDefault();
        document.getElementById('uzasadnienieZrealizowano').value = '';
        $('#uzasadnijWyborZrealizowano').modal('hide');
    }
});
