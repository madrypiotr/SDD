Users = Meteor.users;

if (Meteor.isServer) {

    ReactiveTable.publish("UsersList", Users, function () {
        return {'profile.userType':{$nin:['admin']}};
    });
}
