;
(function () {


    /**
     * Roles collection documents consist only of an id and a role name.
     *   ex: { _id:<uuid>, name: "admin" }
     */
    if (!Meteor.roles) {
        Meteor.roles = new Meteor.Collection("roles")

        // Create default indexes for roles collection
        Meteor.roles._ensureIndex('name', {unique: 1})
    }


    /**
     * Always publish logged-in user's roles so client-side
     * checks can work.
     */
    Meteor.publish(null, function () {
        var userId = this.userId,
            fields = {roles: 1}

        return Meteor.users.find({_id: userId}, {fields: fields})
    });

    Meteor.methods({
        createRole: function (roleName) {
            var result = Roles.createRole(roleName);
            return result;
        },
        removeRole: function (roleName) {
            Roles.deleteRole(roleName);
        },
        createSubRoles: function (data) {
            Meteor.roles.update({name: data.roleName}, {$set: {'subRoles': []}}, {multi: true})
            _.each(data.subRoles, function (subRoleName) {
                Roles.addSubRoleToRole(data.roleName, subRoleName);
            });
        },
        //funkcja do update'a roli w u¿ytkowniku
        createUserRoles: function (data) {
            Meteor.users.update({_id: data.id}, {$set: {'roles': data.roles}}, {multi: true});
        }
    });

}());
