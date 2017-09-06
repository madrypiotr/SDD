(function () {

    'use strict';


    ////////////////////////////////////////////////////////////////////
    // Routing
    //

    // override with meteor-routerFiles navigate method
    Meteor.navigateTo = function (path) {
        Meteor.Router.to(path);
    };

    function emailVerified (user) {
        return _.some(user.emails, function (email) {
            return email.verified;
        });
    }

    Meteor.Router.add({
        '/': function () {
            var user;

            if (Meteor.loggingIn()) {
                console.log('home: loading');
                return 'loading';
            }

            user = Meteor.user();
            if (!user) {
                console.log('home: signin');
                return 'signin';
            }

            if (!emailVerified(user)) {
                console.log('home: awaiting-verification');
                return 'awaiting-verification';
            }

            console.log('home: user found');
            console.log(user.roles);

            // start on 'start' page
            console.log('home: start');
            return 'start';
        },
        '/signin': 'signin',
        '/start': 'start',
        '/secrets': 'secrets',
        '/manage': 'manage',
        '/signout': App.signout,
        '*': 'not_found'
    });

    Meteor.Router.filters({
        checkLoggedIn: function (page) {
            var user;

            if (Meteor.loggingIn()) {

                console.log('filter: loading');
                return 'loading';

            }

            user = Meteor.user();

            if (!user) {

                console.log('filter: signin');
                return 'signin';

            }

            if (!emailVerified(user)) {

                console.log('filter: awaiting-verification');
                return 'awaiting-verification';

            }

            console.log('filter: done');
            return page;


        }
    });

    // make sure user has logged in for all appropriate routes
    Meteor.Router.filter('checkLoggedIn', {
        except:['signin','loading','not-found']
    });

}());
