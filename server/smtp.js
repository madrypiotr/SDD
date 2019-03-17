Meteor.startup(function () {
    if (Meteor.isDevelopment) {
        process.env.MAIL_URL = 'smtp://systemadtestowy@gmail.com :smaga111SMAGA111@smtp.gmail.com:587';
    }
    console.info(process.env.MAIL_URL);
});
