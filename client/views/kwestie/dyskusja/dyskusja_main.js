Template.discussionPostForm.rendered = function () {
    $("#dyskusjaForm").validate({
        messages: {
            message: {
                required: fieldEmptyMessage(),
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

Template.discussionPostForm.events({
    'submit #dyskusjaForm': function (e) {
        e.preventDefault();

        if(commentIsAllowedToInsert()==true) {

            var message = $(e.target).find('[name=message]').val();
            var idKwestia = $(e.target).find('[name=idKwestia]').val();
            var idUser = Meteor.userId();
            var addDate = new Date();
            var isParent = true;
            var idParent = null;
            var czyAktywny = true;
            var userFullName = Meteor.user().profile.fullName;
            var idParent = null;
            var ratingValue = 0;
            var glosujacy = [];

            var post = [{
                idKwestia: idKwestia,
                wiadomosc: message,
                idUser: idUser,
                userFullName: userFullName,
                addDate: addDate,
                isParent: isParent,
                czyAktywny: czyAktywny,
                idParent: idParent,
                wartoscPriorytetu: ratingValue,
                glosujacy: glosujacy
            }];

            if (isNotEmpty(post[0].idKwestia, '') && isNotEmpty(post[0].wiadomosc, 'komentarz') && isNotEmpty(post[0].idUser, '') &&
                isNotEmpty(post[0].addDate.toString(), '') && isNotEmpty(post[0].czyAktywny.toString(), '') &&
                isNotEmpty(post[0].userFullName, '' && isNotEmpty(post[0].isParent.toString(), ''))) {

                Meteor.call('addPost', post, function (error, ret) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error(TXV.ERROR + error.reason);
                        else
                            throwError(error.reason);
                    } else {
                        document.getElementById("message").value = "";

                        var newValue = 0;
                        newValue = Number(RADKING.DODANIE_KOMENTARZA) + getUserRadkingValue(Meteor.userId());
                        Meteor.call('updateUserRanking', Meteor.userId(), newValue, function (error) {
                            if (error) {
                                if (typeof Errors === "undefined")
                                    Log.error(TXV.ERROR + error.reason);
                                else
                                    throwError(error.reason);
                            }
                        });
                    }
                });
            }
        }
        else
            notificationPauseWarning("komentarzy",commentIsAllowedToInsert());
    }
});

Template.discussionRating.events({
    'click #ratingButton': function (e) {

        var ratingValue = parseInt(e.target.value);
        var ratingPostId = e.target.name;
        var glosujacy = [];
        var post = Posts.findOne({_id: ratingPostId});
        var glosujacy = post.glosujacy;
        var glosujacyTab = post.glosujacy.slice();
        var wartoscPriorytetu = parseInt(post.wartoscPriorytetu);
        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        }
        var flag = false;

        for (var i = 0; i < post.glosujacy.length; i++) {
            if (post.glosujacy[i].idUser === Meteor.userId()) {
                flag = false;
                if (post.glosujacy[i].value === ratingValue) {
                    GlobalNotification.error({
                        title: TXV.WARNING,
                        content: TXV.YOU_GAVE_PRIOR,
                        duration: 4 // duration the notification should stay in seconds
                    });
                    return false;
                } else {
                    wartoscPriorytetu -= glosujacyTab[i].value;
                    glosujacyTab[i].value = ratingValue;
                    wartoscPriorytetu += glosujacyTab[i].value;
                }
            } else {
                flag = true;
            }
        }

        if (flag) {
            glosujacyTab.push(object);
            wartoscPriorytetu += ratingValue;
        }

        if (glosujacy.length == 0) {
            glosujacyTab.push(object);
            wartoscPriorytetu += ratingValue;
        }

        var postUpdate = [{
            wartoscPriorytetu: wartoscPriorytetu,
            glosujacy: glosujacyTab
        }];

        Meteor.call('updatePostRating', ratingPostId, postUpdate, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error(TXV.ERROR + error.reason);
                else
                    throwError(error.reason);
            }
        });

    }
});

Template.discussionMain.helpers({
    'getPosts': function (id) {
        return Posts.find({idKwestia: id, isParent: true}, {sort: {wartoscPriorytetu: -1}});
    }
});

Template.discussionPostForm.helpers({
    HasUserRights: function (status,czyAktywny) {
        if(!Meteor.userId())
            return false;
        return status==KWESTIA_STATUS.GLOSOWANA || status==KWESTIA_STATUS.ZREALIZOWANA || status==KWESTIA_STATUS.OCZEKUJACA || czyAktywny==false ? false : true;
    }
});

Template.discussionRating.helpers({
    isUserLogged: function () {
        return Meteor.userId() ? "" : "disabled";
    },
    'getLabelClass': function (value) {
        return value >= 0 ? "label-success" : "label-danger";
    },
    'getSimpleDate':function(date){
        return moment(date).format("YYYY-MM-DD");
    },
    'getFullHourDate': function (date) {
        return moment(date).format("HH:mm:ss");
    },
    isGlosowanaZrealizowanaKosz:function(){
        var post=Posts.findOne({_id:this.idPost});
        var kwestia=Kwestia.findOne({_id:post.idKwestia});
        if(kwestia){
            return kwestia.status==KWESTIA_STATUS.GLOSOWANA || kwestia.status==KWESTIA_STATUS.ZREALIZOWANA || kwestia.czyAktywny==false ? true :false;
        }
    }
});

commentIsAllowedToInsert=function(){
    var myPosts=Posts.find({idUser:Meteor.userId(),idKwestia:this.idKwestia.value,isParent:true},{sort:{addDate:1}});
    if(myPosts.count()>0){
        var array=[];
        myPosts.forEach(function(post){
            array.push(post);
        });
        array= (_.sortBy(array,'addDate')).reverse();
        var lastAddedIssueTime= (_.first(array)).addDate;
        var params=Parametr.findOne();
        if(params)
            return checkTimePause(params.addCommentPause,lastAddedIssueTime);
    }
    else return true;
};
