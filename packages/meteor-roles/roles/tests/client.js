(function () {

    'use strict';

    var users,
        roles = ['admin','editor','user'];

    users = {
        'eve': {
            _id: 'eve',
            roles: ['admin', 'editor']
        },
        'bob': {
            _id: 'bob',
            roles: {
                'group1': ['user'],
                'group2': ['editor']
            }
        },
        'joe': {
            _id: 'joe',
            roles: {
                '__global_roles__': ['admin'],
                'group1': ['editor']
            }
        }
    };

    function testUser (test, username, expectedRoles, group) {
        var user = users[username];

        // test using user object rather than userId to avoid mocking
        _.each(roles, function (role) {
            var expected = _.contains(expectedRoles, role),
                msg = username + ' expected to have \'' + role + '\' permission but does not',
                nmsg = username + ' had un-expected permission ' + role;

            if (expected) {
                test.isTrue(Roles.userIsInRole(user, role, group), msg);
            } else {
                test.isFalse(Roles.userIsInRole(user, role, group), nmsg);
            }
        });
    }


    // Mock Meteor.user() for isInRole handlebars helper testing
    Meteor.user = function () {
        return users.eve;
    };

    Tinytest.add(
        'roles - can check current users roles via template helper',
        function (test) {
            var isInRole,
                expected,
                actual;

            if (!Roles._handlebarsHelpers) {
                // probably running package tests outside of a Meteor app.
                // skip this test.
                return;
            }

            isInRole = Roles._handlebarsHelpers.isInRole;
            test.equal(typeof isInRole, 'function', '\'isInRole\' helper not registered');

            expected = true;
            actual = isInRole('admin, editor');
            test.equal(actual, expected);

            expected = true;
            actual = isInRole('admin');
            test.equal(actual, expected);

            expected = false;
            actual = isInRole('unknown');
            test.equal(actual, expected);
        });

    Tinytest.add(
        'roles - can check if user is in role',
        function (test) {
            testUser(test, 'eve', ['admin', 'editor']);
        });

    Tinytest.add(
        'roles - can check if user is in role by group',
        function (test) {
            testUser(test, 'bob', ['user'], 'group1');
            testUser(test, 'bob', ['editor'], 'group2');
        });

    Tinytest.add(
        'roles - can check if user is in role with Roles.GLOBAL_GROUP',
        function (test) {
            testUser(test, 'joe', ['admin']);
            testUser(test, 'joe', ['admin'], Roles.GLOBAL_GROUP);
            testUser(test, 'joe', ['admin', 'editor'], 'group1');
        });

    Tinytest.add(
        'roles - can get all roles for user by group with periods in name',
        function (test) {
            Roles.addUsersToRoles(users.joe, ['admin'], 'example.k12.va.us');
            test.equal(Roles.getRolesForUser(users.joe, 'example.k12.va.us'), ['admin']);
        });

}());
