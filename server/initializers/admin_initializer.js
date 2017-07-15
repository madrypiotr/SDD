Meteor.startup(function () {
    var data = [
        {
            "Login": "adminSDD",
            "FirstName": "Admin",
            "LastName": "SDD",
            "Profession": "Administrator",
            "Address": "",
            "Zip": "",
            "Gender": "mężczyzna",
            "Phone": "",
            "Email": "p.madry@o2.pl",
            "Web": "",
            "Role": "admin"
        }];
    if ((Meteor.users.find().count() == 0)) {
        var users = [];
        for (var i = 0; i < data.length; i++) {
            users.push({
                    firstName: data[i].FirstName,
                    lastName: data[i].LastName,
                    fulName: data[i].FirstName + ' ' + data[i].LastName,
                    login: data[i].Login,
                    email: data[i].Email,
                    address: data[i].Address,
                    zip: data[i].Zip,
                    gender: data[i].Gender,
                    phone: data[i].Phone,
                    web: data[i].Web,
                    roles: data[i].Role,
                    userType:'admin'
                }
            );
        }
        _.each(users, function (user) {
            var id;

            id = Accounts.createUser({
                username: user.login,
                email: user.email,
                password: "smaga111",
                profile: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    address: user.address,
                    zip: user.zip,
                    gender: user.gender,
                    phone: user.phone,
                    web: user.web,
                    role: user.roles,
                    userType:user.userType
                }
            });

            if (user.roles.length > 0) {
                Roles.addUsersToRoles(id, user.roles);
            }
        });
    }
})