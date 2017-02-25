Powiadomienie = new Mongo.Collection('powiadomienie');

if (Meteor.isServer) {
    ReactiveTable.publish("PowiadomieniaList",Powiadomienie, function () {
        return {"idOdbiorca": this.userId,"czyAktywny":true};
    });
}

