Meteor.methods({
    deleteUser: function (userId) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, 'Musisz być adminem, aby edytować użytkownika.');

        if (user._id == userId)
            throw new Meteor.Error(422, 'Nie możesz usuwać sam siebie.');

        // remove the user
        Meteor.users.remove(userId);
    },

    addUserRole: function (userId, role) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, 'Musisz być adminem, aby edytować użytkownika.');

        if (user._id == userId)
            throw new Meteor.Error(422, 'Nie możesz edytować siebie.');

        // handle invalid role
        if (Meteor.roles.find({name: role}).count() < 1)
            throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

        // handle user already has role
        if (Roles.userIsInRole(userId, role))
            throw new Meteor.Error(422, 'Account already has the role ' + role);

        // add the user to the role
        Roles.addUsersToRoles(userId, role);
    },

    removeUserRole: function (userId, role) {
        var user = Meteor.user();
        console.log(user);
        console.log(userId);
        console.log(role);
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, 'Musisz być adminem, aby edytować użytkownika.');

        if (user._id == userId)
            throw new Meteor.Error(422, 'Nie możesz edytować siebie.');

        // handle invalid role
        if (Meteor.roles.find({name: role}).count() < 1)
            throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

        // handle user already has role
        if (!Roles.userIsInRole(userId, role))
            throw new Meteor.Error(422, 'Account does not have the role ' + role);

        Roles.removeUsersFromRoles(userId, role);
    },

    addRole: function (role) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, 'Musisz być adminem, aby edytować użytkownika.');

        // handle existing role
        if (Meteor.roles.find({name: role}).count() > 0)
            throw new Meteor.Error(422, 'Role ' + role + ' Już istnieje.');

        Roles.createRole(role);
    },

    removeRole: function (role) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, 'Musisz być adminem, aby edytować użytkownika.');

        // handle non-existing role
        if (Meteor.roles.find({name: role}).count() < 1)
            throw new Meteor.Error(422, 'Role ' + role + ' Nie istnieje.');

        if (role === 'admin')
            throw new Meteor.Error(422, 'Cannot delete role admin');

        // remove the role from all users who currently have the role
        // if successfull remove the role
        Meteor.users.update(
            {roles: role},
            {$pull: {roles: role}},
            {multi: true},
            function (error) {
                if (error) {
                    throw new Meteor.Error(422, error);
                } else {
                    Roles.deleteRole(role);
                }
            }
        );
    },

    updateUserInfo: function (id, property, value) {
        var user = Meteor.user();
        if (!user || !Roles.userIsInRole(user, ['admin']))
            throw new Meteor.Error(401, 'Musisz być adminem, aby edytować użytkownika.');

        if (property !== 'profile.name')
            throw new Meteor.Error(422, 'Only \'name\' is supported.');

        obj = {};
        obj[property] = value;
        Meteor.users.update({_id: id}, {$set: obj});

    }
});
