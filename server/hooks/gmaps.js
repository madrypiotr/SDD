'use strict';

var gmapKey = 'AIzaSyB2s36h3R6hAddpvN9TO-tnAzKeoOJkbws';

Parametr.after.insert(function (_id, doc) {
    updateParametrLocation(_id, doc);
});

Parametr.after.update(function (_id, doc, fieldNames) {
    if (fieldNames.indexOf('terytAdres') !== -1 || fieldNames.indexOf('terytCity') !== -1) {
        updateParametrLocation(_id, doc);
    }
});

Meteor.users.after.insert(function (userId, doc) {
    updateUserLocation(userId, doc);
});

Meteor.users.after.update(function (userId, doc, fieldNames) {
    if (fieldNames.indexOf('profile') !== -1) {
        updateUserLocation(userId, doc);
    }
});

var updateParametrLocation = function (_id, doc) {
    var city = doc.terytCity;
    var address = doc.terytAdres;

    getLocation(city, address, function (location) {
        Parametr.direct.update(_id, {
            $set: {
                terytLocation: location
            }
        });
    });
};

var updateUserLocation = function (userId, doc) {
    var city = doc.profile && doc.profile.city;
    var address = doc.profile && doc.profile.address;

    getLocation(city, address, function (location) {
        Meteor.users.direct.update(userId, {
            $set: {
                'profile.location': location
            }
        });
    });
};

var getLocation = function (city, address, callback) {
    if (!city || !address) {
        return;
    }

    var search = encodeURIComponent(city + ', ' + address);
    var options = {url: 'https://maps.google.com/maps/api/geocode/json?address=' + search + '&key=' + gmapKey + '&language=pl', include: false};

    Curl.request(options, function (err, parts) {
        var result, retLocation;
        try {
            parts = parts.split('\r\n');
            var data = parts.pop();
            var jsonData = JSON.parse(data);
            result = jsonData.results[0];
            retLocation = result.geometry.location;
        } catch (error) {
            console.error('getCityCoordinates error', options, error, result);
        }

        if (retLocation) {
            callback(retLocation);
        }
    });
};

Meteor.startup(function () {
    UniConfig.private.runOnce('updateLocationForUsers', function () {
        Meteor.users.find({'profile.location': {$exists: false}}).forEach(function (user) {
            updateUserLocation(user._id, user);
        });
    });
});

Meteor.startup(function () {
    UniConfig.private.runOnce('updateLocationForParameters', function () {
        Parametr.find({terytLocation: {$exists: false}}).forEach(function (parametr) {
            updateParametrLocation(parametr._id, parametr);
        });
    });
});
