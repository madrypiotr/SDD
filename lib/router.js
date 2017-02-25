Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    waitOn: function () {
        return [
            Meteor.subscribe('parametr'),
            Meteor.subscribe("languages")
        ];
    },
    onAfterAction: function(){
        var item = Parametr.findOne({});
        if (!!item && !!item.nazwaOrganizacji)
            document.title = item.nazwaOrganizacji;
        else
            document.title = Router.current().route.getName();
    }
});

Router.map(function () {
    this.route('home', {
        path: '/',
        waitOn: function () {
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("zespolyRealizacyjne"),
                this.subscribe("notificationsNotRead",Meteor.userId()),
                this.subscribe("usersType")
            ]
        },
        onBeforeAction: function () {
            if (Meteor.user()) {
                if (IsAdminUser()) {
                    Router.go('admin');
                }
                else {
                    this.render('listKwestia');
                }
            }
            this.render('listKwestia');
        }
    });

    this.route('admin', {
        path: '/admin',
        template: 'adminTemplate',
        data: function () {
            return Users.find()
        },
        onBeforeAction: function () {
            if (IsAdminUser())
                this.next();
            else
                Router.go('home');
        }
    });
    //---------------------------------------------------
    // user - ACCOUNT
    this.route('activate_account', {
        path: '/account/activate_account/:linkAktywacyjny',
        template: 'activateAccount',
        onBeforeAction: function () {
            this.next();
        },
        waitOn: function () {
            this.subscribe("usersType");
            this.subscribe('userDraftByLinkAktywacyjny', this.params.linkAktywacyjny);
        }
    });
    this.route('answer_invitation', {
        path: '/account/answer_invitation/:linkAktywacyjny',
        template: 'answerInvitation',
        onBeforeAction: function () {
            this.next();
        },
        waitOn: function () {
            this.subscribe("kwestieNoDetails");
            this.subscribe("parametr");
            this.subscribe("zespolyRealizacyjneDraft");
            this.subscribe("zespolyRealizacyjne");
            this.subscribe("notificationsNotRead",Meteor.userId());
            this.subscribe("usersType");
            this.subscribe('userDraftByLinkAktywacyjny', this.params.linkAktywacyjny);
        }
    });
    this.route('login_form', {
        path: '/account/login',
        template: 'loginForm',
        onBeforeAction: function () {
            if (Meteor.userId() != null)
                Router.go('home');
            else
                this.next();
        },
        waitOn: function () {
            this.subscribe("usersType");
        }
    });
    this.route('forgotten_password', {
        path: '/account/forgotten_password',
        template: 'forgottenPassword',
        onBeforeAction: function () {
            if (Meteor.userId() != null)
                Router.go('home');
            else
                this.next();
        },
        waitOn: function () {
            this.subscribe("usersType");
        }
    });
    this.route('reset_password', {
        path: '/account/reset_password/:token',
        template: 'resetPassword',
        data: function () {
            return this.params.token
        },
        onBeforeAction: function () {
            if (Meteor.userId() != null)
                Router.go('home');
            else
                this.next();
        },
        waitOn: function () {
            this.subscribe('userChangePassword', this.params.token);
            this.subscribe("usersType");
        }
    });
    this.route('register_form', {
        path: '/account/register',
        template: 'registerForm',
        onBeforeAction: function () {
            if (Meteor.userId() != null)
                Router.go('home');
            else
                this.next();
        },
        waitOn: function () {
            this.subscribe("languages");
            this.subscribe("zespolyRealizacyjne");
            this.subscribe("usersType")
        }
    });

    this.route('doradca_form', {
        path: '/doradca_form',
        template: 'doradcaForm',
        onBeforeAction: function () {
            this.next();
        },
        waitOn: function () {
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersType"),
                this.subscribe("parametr"),
                this.subscribe("zespolyRealizacyjne"),
                this.subscribe("zespolyRealizacyjneDraft"),
                this.subscribe("kwestieNoDetails")
            ]
        }
    });

    this.route('czlonek_zwyczajny_form', {
        path: '/czlonek_zwyczajny_form/',
        template: 'czlonekZwyczajnyForm',
        data:function(){
            return Users.findOne({_id:Meteor.userId()});
        },
        onBeforeAction: function () {
            if(Meteor.user())
                Router.go("home");
            else
                this.next();
        },
        waitOn: function () {
            this.subscribe("tematy");
            this.subscribe("rodzaje");
            this.subscribe("usersType");
            this.subscribe("parametr");
            this.subscribe("zespolyRealizacyjne");
            this.subscribe("zespolyRealizacyjneDraft");
            this.subscribe("kwestieNoDetails"),
            this.subscribe("notificationsNotRead",Meteor.userId());
        }
    });

    this.route('profile_edit', {
        path: '/account/edit',
        template: 'profileEdit',
        data: function () {
            return Users.findOne({_id: Meteor.userId()});
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();

        },
        waitOn: function () {
            this.subscribe("usersType");
            this.subscribe("notificationsNotRead",Meteor.userId())
        }
    });
    this.route('manage_account', {
        path: '/account/manage',
        template: 'manageAccount',
        data: function () {
            return Users.findOne({_id: Meteor.userId()});
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
        },
        waitOn: function () {
            this.subscribe("usersType");
            this.subscribe("notificationsNotRead",Meteor.userId())
        }
    });
    //---------------------------------------------------

    this.route('listParametr', {
        path: '/parameters',
        template: 'listParametr',
        data: function () {
            return Parametr.findOne({})
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.render('accessDenied');
            else
                this.next();
        },
        waitOn: function () {
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaj"),
                this.subscribe("usersType")
            ]
        }
    });
    //---------------------------------------------------

    //admin - LANGUAGES
    this.route('listLanguages', {
        path: '/languages_list',
        template: 'listLanguages',
        waitOn: function () {
            return [this.subscribe("languages")];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });
    this.route('addLanguage', {
        path: '/add_language',
        template: 'addLanguage',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });

    this.route('editLanguage', {
        path: '/edit_language/:_id',
        template: 'editLanguage',
        waitOn: function () {
            return [this.subscribe("language", this.params._id)]
        },
        data: function () {
            return Languages.findOne({_id: this.params._id})
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });

    this.route('setPagesInfo', {
        path: '/set_pages_info/:_id',
        template: 'setPagesInfo',
        waitOn: function () {
            return [
                this.subscribe("language", this.params._id),
                this.subscribe("pagesInfo")
            ]
        },
        data: function () {
            return Languages.findOne({_id: this.params._id})
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
        }
    });
    //---------------------------------------------------

    // KWESTIA dashboard
    this.route('listKwestia', {
        path: '/issues_list',
        template: 'listKwestia',
        waitOn: function () {
            return [
                this.subscribe("kwestieNoDetails"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("zespolyRealizacyjneDraft"),
                this.subscribe("notificationsNotRead",Meteor.userId()),
                this.subscribe("usersType")
            ];
        },
        onBeforeAction: function () {
            this.next();
        }
    });

    this.route('addKwestia', {
        path: '/add_issue',
        template: 'addKwestiaForm',
        data: function () {
            return !!Session.get("kwestiaPreview") ? Session.get("kwestiaPreview") : null;
        },
        waitOn: function () {
            return [
                this.subscribe("rodzaje"),
                this.subscribe("tematy"),
                this.subscribe("kwestieNazwa"),
                this.subscribe("usersType"),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        }
    });

    this.route('addKwestiaOpcja', {
        path: '/add_issue_option',
        template: 'addKwestiaOpcjaForm',
        data: function () {
            return Session.get("actualKwestia");
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        },
        waitOn: function () {
            return [
                this.subscribe("kwestieNoDetails"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersType"),
                this.subscribe("zespolRealizacyjny",Session.get("actualKwestia").idZespolRealizacyjny),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ]
        }
    });

    this.route('previewKwestiaOpcja', {
        path: '/issue_option_preview',
        template: 'previewKwestiaOpcja',
        data: function () {
            return Session.get("actualKwestia");
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        },
        waitOn:function(){
            return [
                this.subscribe("zespolRealizacyjny",Session.get("actualKwestia").idZespolRealizacyjny),
                this.subscribe("usersTypeRanking"),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ]
        }
    });


    this.route('previewKwestia', {
        path: '/issue_preview',
        template: 'previewKwestia',
        data: function () {
            return Session.get("kwestiaPreview");
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (!IsAdminUser())
                this.next();
            else
                this.render('accessDenied');
        },
        waitOn:function(){
            return [
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersType"),
                this.subscribe("notificationsNotRead",Meteor.userId()),
                this.subscribe("kwestieNoDetails")
            ]
        }
    });

    this.route('informacjeKwestia', {
        path: '/issue_info/:_id',
        template: 'informacjeKwestia',
        data: function () {
            Session.set("idKwestia", this.params._id);
            return Kwestia.findOne(this.params._id);
        },
        waitOn: function () {
            var flag = false;
            var zr=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"});

            if(zr) {
                if (zr.protector) {
                    if (zr.protector == Meteor.userId())
                        flag = true;
                }
            }

            if(flag==true){
                return [
                    this.subscribe("usersFullNamesTypesRanking"),
                    this.subscribe("kwestie"),
                    this.subscribe("tematy"),
                    this.subscribe("rodzaje"),
                    this.subscribe("postsByKwestiaId", this.params._id),
                    this.subscribe("parametr"),
                    this.subscribe("activeParametrDraft"),
                    this.subscribe("zespolyRealizacyjne"),
                    this.subscribe("zespolyRealizacyjneDraft"),
                    this.subscribe("notificationsNotReadIssue",Meteor.userId())
                ]
            }else{
                return [
                    this.subscribe("usersFullNamesTypesRanking"),
                    this.subscribe("kwestieNoPeselEmailDetails"),
                    this.subscribe("tematy"),
                    this.subscribe("rodzaje"),
                    this.subscribe("postsByKwestiaId", this.params._id),
                    this.subscribe("parametr"),
                    this.subscribe("activeParametrDraft"),
                    this.subscribe("zespolyRealizacyjne"),
                    this.subscribe("zespolyRealizacyjneDraft"),
                    this.subscribe("notificationsNotReadIssue",Meteor.userId())
                ]
            }
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else {
                //this.subscribe("postsByKwestiaId", this.params._id);
                this.next();
            }
        }
    });

    //-----------------------------------------
    // Archiwum
    this.route('archiwum', {
        path: '/archives',
        template: 'archiwum',
        waitOn: function () {
            return [
                this.subscribe("kwestieNoDetails"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("usersType"),
                this.subscribe("notificationsNotRead",Meteor.userId())
            ];
        },
        onBeforeAction: function () {
            this.next();
        }
    });
    //-------------------------------------------------------------

    //-------- REALIZACJA --------
    this.route('realizacja', {
        path: '/realization',
        template: 'realizacja',
        onBeforeAction: function () {
            this.next();
        },
        waitOn:function(){
            this.subscribe("kwestieNoDetails");
            this.subscribe("reports");
            this.subscribe("rodzaje");
            this.subscribe("tematy");
            this.subscribe("usersTypeRanking");
            this.subscribe("notificationsNotRead",Meteor.userId());
            this.subscribe("zespolyRealizacyjne");
        }
    });
    this.route('informacjeRaport', {
        path: '/report_info/:_id',
        template: 'informacjeRaport',
        data:function(){
            return Raport.findOne(this.params._id);
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.render('accessDenied');
            else
                this.next();
        },
        waitOn: function () {
            this.subscribe("usersType");
            this.subscribe("notificationsNotRead",Meteor.userId());
            this.subscribe("report",this.params._id);
            this.subscribe("reportsIssue",this.params._id);
        }
    });
    this.route('listRaport', {
        path: '/reports_list/:_id',
        template: 'listRaport',
        data:function(){
          return Raport.find({idKwestia:{$in:[this.params._id]}});
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else if (IsAdminUser())
                this.render('accessDenied');
            else
                this.next();
        },
        waitOn: function () {
            this.subscribe("usersType");
            this.subscribe("kwestiaNoDetails",this.params._id),
            this.subscribe("notificationsNotRead",Meteor.userId()),
            this.subscribe("reportsByIssue",this.params._id);
        }
    });

    //-------- GLOSOWANIE --------
    this.route('glosowanie', {
        path: '/vote',
        template: 'glosowanie',
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else
                this.next();
        },
        waitOn:function(){
            this.subscribe("tematy");
            this.subscribe("rodzaje");
            this.subscribe("usersType");
            this.subscribe("notificationsNotRead",Meteor.userId())
        }
    });

    this.route('sendMessage', {
        path: '/new_message/:_id',
        template: 'sendMessage',
        data: function () {
            return Users.findOne({_id: this.params._id});
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('/account/login');
            }
            else this.next();
        },
        waitOn: function () {
            this.subscribe("usersTypeAndNames");
            this.subscribe("notificationsNotRead",Meteor.userId());
        }
    });


    this.route('administracjaUserMain', {
        path: '/settings/',
        template: 'administracjaUserMain',
        data:function(){
            return Parametr.findOne();
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('home');
            }
            else this.next();
        },
        waitOn: function () {
            this.subscribe("kwestieNoDetails");
            this.subscribe('usersType');
            this.subscribe('usersDraftUserIdIsActive');
            this.subscribe("parametr");
            this.subscribe("activeParametrDraft");
            this.subscribe("zespolyRealizacyjne");
            this.subscribe("zespolyRealizacyjneDraft");
            this.subscribe("notificationsNotRead",Meteor.userId());
            this.subscribe("tematy");
            this.subscribe("rodzaje");
        }
    });

    this.route('notification_list', {
        path: '/notification_list',
        template: 'notificationList',
        waitOn: function () {
            return [
                this.subscribe("myNotifications",Meteor.userId()),
                this.subscribe("usersTypeFullNames"),
                this.subscribe("kwestieNoDetails")
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('home');
            }
            else this.next();
        }
    });
    this.route('notificationInfo', {
        path: '/notification_info/:_id',
        template: 'notificationInfo',
        data:function(){
            return Powiadomienie.findOne({_id:this.params._id});
        },
        waitOn: function () {
            return [
                this.subscribe("myNotifications",Meteor.userId()),
                this.subscribe("usersTypeFullNames"),
                this.subscribe("userDraftActivationLink", Meteor.userId()),
                this.subscribe("kwestieNoDetails"),
                this.subscribe("tematy"),
                this.subscribe("rodzaje"),
                this.subscribe("parametr")
            ];
        },
        onBeforeAction: function () {
            if (!Meteor.user()) {
                this.render('accessDenied');
                this.stop();
                Router.go('home');
            }
            else
                this.next();
        }
    });
});
//---------------------------------------------------
var requireLogin = function () {
    if (!Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');
    }
    else this.next();
}
Router.onBeforeAction(requireLogin, {only: 'addUserForm'});