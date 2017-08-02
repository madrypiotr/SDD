// pobiera pliki .html z folderu private
SSR.compileTemplate ( 'email_act',Assets.getText ( 'email_act.html' ) );
SSR.compileTemplate ( 'email_added_issue',Assets.getText ( 'email_added_issue.html' ) );
SSR.compileTemplate ( 'email_new_message',Assets.getText ( 'email_new_message.html' ) );
SSR.compileTemplate ( 'email_lobbing_issue',Assets.getText ( 'email_lobbing_issue.html' ) );
SSR.compileTemplate ( 'email_started_voting',Assets.getText ( 'email_started_voting.html' ) );
SSR.compileTemplate ( 'email_application_confirmation',Assets.getText ( 'email_application_confirmation.html' ) );
SSR.compileTemplate ( 'email_application_rejected',Assets.getText ( 'email_application_rejected.html' ) );
SSR.compileTemplate ( 'email_application_accepted',Assets.getText ( 'email_application_accepted.html' ) );
SSR.compileTemplate ( 'email_application_accepted_existing_user',Assets.getText ( 'email_application_accepted_existing_user.html' ) );
SSR.compileTemplate ( 'email_login_data',Assets.getText ( 'email_login_data.html' ) );
SSR.compileTemplate ( 'email_no_realization_report',Assets.getText ( 'email_no_realization_report.html' ) );
SSR.compileTemplate ( 'email_reset_password',Assets.getText ( 'email_reset_password.html' ) );

Template.email_started_voting.helpers ( {
    nadanoPriorytet: function ( kwestiaId,userId ) {
        var kwestia = Kwestia.findOne ( { _id:kwestiaId } );

        if ( kwestia ) {
            var glosujacy = _.pluck ( kwestia.glosujacy, 'idUser' );
            return ( _.contains ( glosujacy, userId ) ) ? true : false;
        }
        return false;
    },
    mojPriorytet: function ( kwestiaId,userId ) {
        var kwestia = Kwestia.findOne ( { _id:kwestiaId } );
        var myObj= _.reject ( kwestia.glosujacy,function ( obj ) {return obj.idUser!=userId } );
        return myObj[0] ? myObj[0].value : null;
    }
 } );
Template.email_no_realization_report.helpers ( {
    czlonekZR: function ( idZespolRealizacyjny ) {
        var zr=ZespolRealizacyjny.findOne ( { _id:idZespolRealizacyjny } );
        var array=[];
        _.each ( zr.zespol,function ( czlonekId ) {
            var user=Users.findOne ( { _id:czlonekId } );
            var obj={
                 fullName:user.profile.fullName,
                 url:Meteor.absoluteUrl () + "new_message/" + czlonekId
            };
            array.push ( obj );
        } );
        return array;
    }
 } );

Meteor.methods ( {
    registerAddKwestiaNotification: function ( prop ) {
        if ( !prop.users ) {
            var allUsers = Users.find ( { } ).fetch ();
            prop.users = allUsers;
        }
    },
    sendEmail: function ( to, from, subject, text ) {
        this.unblock ();
        Email.send ( {
            to: to,
            from: from,
            subject: subject,
            text: text
        } );
    },
    sendDirectMessageToUser: function ( receiverId,senderName, subject, text ) {
        this.unblock ();
        var parametr = Parametr.findOne ( { } );
        var receiver=Users.findOne ( { _id:receiverId } );
        var html = SSR.render ( 'email_new_message',{
            ogranisation:parametr.nazwaOrganizacji,
            welcomeGender:recognizeSex ( receiver ),
            fullName:receiver.profile.fullName,
            text:text,
            sender:senderName
        } );
        Email.send ( {
            to: receiver.emails[0].address,
            from: senderName,
            subject: subject,
            html: html
        } );
    },
    sendEmailForAll: function ( from, subject, text ) {
        var users= Users.find ();
        this.unblock ();
        _.each ( users,function ( item ) {
            Email.send ( {
                to: item.emails[0].address,
                from: from,
                subject: subject,
                text: text
            } );
        } );
    },
    sendEmailAddedIssue: function ( idKwestia, lang ) {
        this.unblock ();
        var parametr = Parametr.findOne ( { } );
        var kwestiaItem = Kwestia.findOne ( { _id:idKwestia } );
        var rodzaj = Rodzaj.findOne ( { _id:kwestiaItem.idRodzaj } );
        var temat = Temat.findOne ( { _id:kwestiaItem.idTemat } );
        if ( !rodzaj )
            rodzaj=TAPi18n.__ ( 'txv.BELONGS_TO_THE_SYSTEM', null, lang );
        else
            rodzaj=rodzaj.nazwaRodzaj;
        if ( !temat )
            temat=TAPi18n.__ ( 'txv.TECHNICAL', null, lang );
		
        else temat=temat.nazwaTemat;

        Users.find ( { } ).forEach ( function ( item ) {
            if ( !Roles.userIsInRole ( item, ['admin'] ) && item.profile.userType==USERTYPE.CZLONEK ) {
                var html = SSR.render ( 'email_added_issue',{
                    welcomeGender:recognizeSex ( item ),
                    userData:item.profile.fullName,
                    organizacja: parametr.nazwaOrganizacji,
                    krotkaTresc: kwestiaItem.krotkaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    idUser: item._id,
                    rodzaj: rodzaj,
                    temat: temat,
                    url:Meteor.absoluteUrl () + "issue_info/" + kwestiaItem._id,
                    urlLogin:Meteor.absoluteUrl () + "account/login",

                    globDoNotAnswerThat: TAPi18n.__ ( 'glob.DoNotAnswerThat', null, lang ),
                    globIntroducedAnewIssue: TAPi18n.__ ( 'glob.IntroducedAnewIssue', null, lang ),
                    globLinkToThisIssue: TAPi18n.__ ( 'glob.LinkToThisIssue', null, lang ),
                    globLogIn: TAPi18n.__ ( 'glob.LogIn', null, lang ),
                    globLoginToTheSystem: TAPi18n.__ ( 'glob.LoginToTheSystem', null, lang ),
                    globOn: TAPi18n.__ ( 'glob.On', null, lang ),
                    globShortSystemName: TAPi18n.__ ( 'glob.ShortSystemName', null, lang ),
                    globSubject: TAPi18n.__ ( 'glob.Subject', null, lang ),
                    globThisIsAnAutomaticInformationSystem: TAPi18n.__ ( 'glob.ThisIsAnAutomaticInformationSystem', null, lang ),
                    globToTheSystem: TAPi18n.__ ( 'glob.ToTheSystem', null, lang ),
                    globType: TAPi18n.__ ( 'glob.Type', null, lang ),
                    globWelcomeToTheIssuesOfDeliberationDiscussionAndPrioritize: TAPi18n.__ ( 'glob.WelcomeToTheIssuesOfDeliberationDiscussionAndPrioritize', null, lang )
            } );
                Email.send ( {
                    to: item.emails[0].address,
                    from: TAPi18n.__ ( 'txv.SYSTEM_NAME', null, lang ),
                    subject: TAPi18n.__ ( 'txv.ADD_NEW_ISSUE', null, lang ),
                    html: html
                } );
            }
        } );
    },
    sendEmailAct: function ( idKwestia, lang ) {
        this.unblock ();
        var parametr = Parametr.findOne ( { } );
        var kwestiaItem = Kwestia.findOne ( { _id:idKwestia } );
        var rodzaj = Rodzaj.findOne ( { _id:kwestiaItem.idRodzaj } );
        var temat = Temat.findOne ( { _id:kwestiaItem.idTemat } );
        Users.find ( { } ).forEach ( function ( item, lang ) {
            if ( !Roles.userIsInRole ( item, ['admin'] ) ) {
                var html = SSR.render ( 'email_act',{
                    welcomeGender:recognizeSex ( item ),
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    szczegolyKwestii: kwestiaItem.szczegolowaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    rodzaj: rodzaj.nazwaRodzaj,
                    temat: temat.nazwaTemat,
                    userType: item.profile.userType
                } );
                Email.send ( {
                    to: item.emails[0].address,
                    from: TAPi18n.__ ( 'txv.SYSTEM_NAME', null, lang ),
                    subject: TAPi18n.__ ( 'txv.PASS_A_RESOLUTION', null, lang ),
                    html: html
                } );
            }
        } );
    },
    sendEmailNoRealizationReport: function ( idKwestia, lang ) {
        this.unblock ();
        var parametr = Parametr.findOne ( { } );
        var kwestiaItem = Kwestia.findOne ( { _id:idKwestia } );
        var rodzaj = Rodzaj.findOne ( { _id:kwestiaItem.idRodzaj } );
        var temat = Temat.findOne ( { _id:kwestiaItem.idTemat } );
        if ( !rodzaj )
            rodzaj=TAPi18n.__ ( 'txv.BELONGS_TO_THE_SYSTEM', null, lang );
        else
            rodzaj=rodzaj.nazwaRodzaj;
        if ( !temat )
            temat=TAPi18n.__ ( 'txv.TECHNICAL', null, lang );
        else temat=temat.nazwaTemat;

        Users.find ( { } ).forEach ( function ( item, lang ) {

            if ( !Roles.userIsInRole ( item, ['admin'] ) && item.profile.userType==USERTYPE.CZLONEK ) {
                var html = SSR.render ( 'email_no_realization_report',{
                    welcomeGender:recognizeSex ( item ),
                    userData:item.profile.fullName,
                    organizacja: parametr.nazwaOrganizacji,
                    krotkaTresc: kwestiaItem.krotkaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idZespolRealizacyjny:kwestiaItem.idZespolRealizacyjny,
                    rodzaj: rodzaj,
                    temat: temat,
                    url:Meteor.absoluteUrl () + "issue_info/" + kwestiaItem._id,
                    urlLogin:Meteor.absoluteUrl () + "account/login"//
                } );
                Email.send ( {
                    to: item.emails[0].address,
                    from: TAPi18n.__ ( 'txv.SYSTEM_NAME', null, lang ),
                    subject: TAPi18n.__ ( 'txv.NO_CURRENT_REPORT', null, lang ),
                    html: html
                } );
            }
        } );
    },
    sendEmailLobbingIssue: function ( idKwestia,uzasadnienie,idAuthor, lang ) {
        this.unblock ();
        var parametr = Parametr.findOne ( { } );
        var kwestiaItem = Kwestia.findOne ( { _id:idKwestia } );
        var htmlText=null;
        var rodzaj=null;
        var temat=null;
        var url=Meteor.absoluteUrl () + "issue_info/" + kwestiaItem._id;
        if ( kwestiaItem.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ) {
            rodzaj=TAPi18n.__ ( 'txv.TECHNICAL', null, lang );
            temat=TAPi18n.__ ( 'txv.BELONGS_TO_THE_SYSTEM', null, lang );
        }
        else{
            rodzaj = Rodzaj.findOne ( { _id:kwestiaItem.idRodzaj } ).nazwaRodzaj;
            temat = Temat.findOne ( { _id:kwestiaItem.idTemat } ).nazwaTemat;
        }

        var author=Users.findOne ( { _id:idAuthor } );
        Users.find ( { } ).forEach ( function ( item, lang ) {
            if ( !Roles.userIsInRole ( item, ['admin'] ) && item.profile.userType==USERTYPE.CZLONEK ) {
                var html = SSR.render ( 'email_lobbing_issue',{
                    welcomeGender:recognizeSex ( item ),
                    username:item.username,
                    organizacja: parametr.nazwaOrganizacji,
                    krotkaTresc:kwestiaItem.krotkaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    rodzaj: rodzaj,
                    temat: temat,
                    userType: item.profile.userType,
                    uzasadnienie: uzasadnienie,
                    email: item.emails[0].address,
                    fullName:item.profile.fullName,
                    imie: author.profile.firstName,
                    nazwisko: author.profile.lastName,
                    url:url

                } );
                Email.send ( {
                    to: item.emails[0].address,
                    from: author.profile.firstName + " " + author.profile.lastName,
                    subject: TAPi18n.__ ( 'txv.SUPPORT_MY_ISSUE', null, lang ),
                    html: html
                } );
            }
        } );
    },
    sendEmailStartedVoting: function ( idKwestia, lang ) {
        this.unblock ();
        var parametr = Parametr.findOne ( { } );
        var kwestiaItem = Kwestia.findOne ( { _id:idKwestia } );
        var temat=null;
        var rodzaj=null;
        if ( kwestiaItem.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ) {
            temat=TAPi18n.__ ( 'txv.BELONGS_TO_THE_SYSTEM', null, lang );
            rodzaj=TAPi18n.__ ( 'txv.TECHNICAL', null, lang );
        }
        else {
            rodzaj = Rodzaj.findOne ( { _id: kwestiaItem.idRodzaj } ).nazwaRodzaj;
            temat = Temat.findOne ( { _id: kwestiaItem.idTemat } ).nazwaTemat;
        }
        var urlLogin=Meteor.absoluteUrl () + "account/login";
        var url=Meteor.absoluteUrl () + 'issue_info/' + kwestiaItem._id;
        var kworum=null;
        if ( rodzaj=="Statutowe" )
            kworum=liczenieKworumStatutowe ();
        else
            kworum=liczenieKworumZwykle ();
        Users.find ( { } ).forEach ( function ( item, lang ) {
            if ( !Roles.userIsInRole ( item, ['admin'] ) && item.profile.userType==USERTYPE.CZLONEK ) {
                var html = SSR.render ( 'email_started_voting',{
                    welcomeGender:recognizeSex ( item ),
                    username:item.profile.fullName,
                    organizacja: parametr.nazwaOrganizacji,
                    szczegolyKwestii: kwestiaItem.krotkaTresc,
                    nazwaKwestii: kwestiaItem.kwestiaNazwa,
                    idKwestii:kwestiaItem._id,
                    dataGlosowania:moment ( kwestiaItem.dataGlosowania ).format ( "DD-MM-YYYY, HH:mm" ),
                    rodzaj: rodzaj,
                    idUser:item._id,
                    temat: temat,
                    wartoscPriorytetu:kwestiaItem.wartoscPriorytetu,
                    glosujacy:kwestiaItem.glosujacy.length,
                    kworum: kworum,
                    urlLogin:urlLogin,
                    url:url
                } );
                Email.send ( {
                    to: item.emails[0].address,
                    from: TAPi18n.__ ( 'txv.SYSTEM_NAME', null, lang ),
                    subject: BEGAN_VOTING_ISSUE,
                    html: html
                } );
            }
        } );
    },
    sendApplicationConfirmation: function ( idUser, lang ) {
        var userData = UsersDraft.findOne ( { _id: idUser } );
        var data=applicationEmail ( userData,"confirm",null );
        Email.send ( {
            to: data.to,
            from: data.to,
            subject: TAPi18n.__ ( 'txv.CONFIRM_OF_RECE', null, lang ) + data.userType,
            html: data.html
        } );
    },
    sendApplicationRejected: function ( userData, lang ) {
        var data=applicationEmail ( userData,"reject",null );

        Email.send ( {
            to: data.to,
            from: data.to,
            subject: TAPi18n.__ ( 'txv.REJECT_OF_APLIC', null, lang ) + data.userType,
            html: data.html
        } );
    },
    sendApplicationAccepted: function ( userData,text, lang ) {
        var data=applicationEmail ( userData,text,null );
        Email.send ( {
            to: data.to,
            from: data.to,
            subject: TAPi18n.__ ( 'txv.POSITIVE_CONSIDER', null, lang ) + data.userType,
            html: data.html
        } );
    },
    sendFirstLoginData: function ( idUser,pass, lang ) {

        var userData = Users.findOne ( { _id:idUser } );
        var data=applicationEmail ( userData,"loginData",pass );
        Email.send ( {
            to: data.to,
            from: data.to,
            subject: TAPi18n.__ ( 'txv.DATA_LOGGING', null, lang ) + Parametr.findOne ().nazwaOrganizacji,
            html: data.html
        } );
    },
    sendResetPasswordEmail: function ( email, pass ) {
        var users = Users.find ();
        users.forEach ( function ( user ) {
            _.each ( user.emails, function ( em, lang ) {
                if ( _.isEqual ( em.address.toLowerCase (), email.toLowerCase () ) ) {
                    var userData = user;
                    var data=applicationEmail ( userData, "resetPassword", pass );
                    Email.send ( {
                        to: data.to,
                        from: data.to,
                        subject: TAPi18n.__ ( 'txv.RESET_ACCES_PASS', null, lang ) + Parametr.findOne ().nazwaOrganizacji,
                        html: data.html
                    } );
                }
            } );
        } );
    }
 } );
recognizeSex=function ( userData, lang ) {
    var welcomeGender=null;
    if ( userData.profile.pesel ) {
        if ( userData.profile.pesel!="" ) {
            var pesel = userData.profile.pesel.substring ( 9, 10 );
            if ( _.contains ( ['1', '3', '5', '7', '9'], pesel ) )
                welcomeGender = TAPi18n.__ ( 'txv.HONORABLE', null, lang );
            else welcomeGender = DEAR
        }
        else
            welcomeGender=TAPi18n.__ ( 'txv.MR_MRS', null, lang );
    }
    else
        welcomeGender=TAPi18n.__ ( 'txv.MR_MRS', null, lang );

    return welcomeGender;
};
applicationEmail=function ( userData,emailTypeText,passw, lang ) {
    var urlLogin=Meteor.absoluteUrl () + "account/login";
    var welcomeGender=recognizeSex ( userData );

    var userTypeData = null;
    switch ( userData.profile.userType ) {
        case USERTYPE.CZLONEK: userTypeData=TAPi18n.__ ( 'txv.ORD_MEMBER', null, lang );break;
        case USERTYPE.DORADCA: userTypeData=TAPi18n.__ ( 'txv.COUNSELOR', null, lang );break;
    }
    var url=null;
    var login=null;
    var pass=null;
    var to=userData.email;
    var textGender=null;
    var urlResetPassword = null;
    if ( emailTypeText=="reject" ) {
        emailTypeText = 'email_application_rejected';
    }
    else if ( emailTypeText == "acceptNew" ) {
        emailTypeText = 'email_application_accepted';
        if ( userData.linkAktywacyjny )
            url = Meteor.absoluteUrl () + "account/activate_account/" + userData.linkAktywacyjny;
        if ( welcomeGender == TAPi18n.__ ( 'txv.HONORABLE', null, lang ) )
            textGender = TAPi18n.__ ( 'txv.H_COULD', null, lang );
        else if ( welcomeGender == TAPi18n.__ ( 'txv.DEAR', null, lang ) )
            textGender = TAPi18n.__ ( 'txv.D_COULD', null, lang );
        else
            textGender = TAPi18n.__ ( 'txv.HD_COULD', null, lang );
    }
    else if ( emailTypeText=="acceptExisting" ) {
        emailTypeText = 'email_application_accepted_existing_user';
    }
    else if ( emailTypeText=="loginData" ) {
        emailTypeText = 'email_login_data';
        login=userData.username;
        pass=passw;
        to=userData.emails[0].address
    } else if ( emailTypeText == "resetPassword" ) {
        emailTypeText = 'email_reset_password';
        login=userData.username;
        pass=passw;
        to=userData.emails[0].address;

        var token = Random.secret ();
        var when = new Date ();
        var tokenRecord = {
            token: token,
            email: userData.emails[0].address,
            when: when
        };
        urlResetPassword = Meteor.absoluteUrl () + "account/reset_password/" + token;
        Meteor.users.update ( userData._id, {$set: {
            "services.password.reset": tokenRecord
        } } );
    }
    else{
       emailTypeText = 'email_application_confirmation';
        var kwestia=Kwestia.findOne ( {czyAktywny: true,idUser:userData._id } );
        url=Meteor.absoluteUrl () + "issue_info/" + kwestia._id;
    }
    var userName=null;
    if ( userData.profile.firstName!=null && userData.profile.firstName.trim ()!= '' )
        userName=userData.profile.firstName + " " + userData.profile.lastName;
    else
        userName=userData.email;
    var html = SSR.render ( emailTypeText,{
        username:userName,
        organizacja: Parametr.findOne ().nazwaOrganizacji,
        userTypeData:userTypeData,
        url:url,
        urlLogin:urlLogin,
        welcomeType:welcomeGender,
        login:login,
        password:pass,
        textGender:textGender,
        urlResetPassword: urlResetPassword
    } );
    var obj={
        to:to,
        from: TAPi18n.__ ( 'txv.SYSTEM_NAME', null, lang ) + Parametr.findOne ().nazwaOrganizacji,
        html:html,
        userType:userTypeData
    };
    return obj;
};
