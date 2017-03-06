/**
 * Created by Bartłomiej Szewczyk on 2015-11-26.
 */
Template.addTopicModalInner.rendered = function(){
    document.getElementById("addTopicModalBtn").disabled = false;
};
Template.addTopicModalInner.events({
    'click #addTopicModalBtn': function(){
        document.getElementById("addTopicModalBtn").disabled = true;
        Meteor.setTimeout(function(){
            document.getElementById("addTopicModalBtn").disabled = false;
        }, 2000);

        var topicName = document.getElementById("topicName").value;

        var topicsCount = Temat.find({nazwaTemat: topicName}).count();

        if(topicsCount > 0){
            GlobalNotification.error({
                title: TXV.WARNING,
                content: TXV.GIVEN_TOPIC_EXISTS,
                duration: 4 // duration the notification should stay in seconds
            });
        }else{
            if(topicName == "" || topicName == null){
                GlobalNotification.error({
                    title: TXV.WARNING,
                    content: TXV.FIELD_TOPIC_CNBE,
                    duration: 4 // duration the notification should stay in seconds
                });
            }else {

                document.getElementById("addTypeBtn").disabled = false;
                Session.setPersistent("choosenTopic", topicName);
                Session.setPersistent("choosenType", null);
                $("#addTopicModalId").modal("hide");
            }
        }
    }
});