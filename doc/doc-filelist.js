var tree = {
	"files": ["i18n.js", "README.md", "smart.json"],
	"dirs": {
		"both": {
			"files": ["emailNotifications.js"]
		},
		"client": {
			"files": ["main.html"],
			"dirs": {
				"helpers": {
					"files": ["config.js", "errors.js", "jquery.tablesorter.js", "methods_kwestia.js", "methods_users.js", "methods_utils.js", "methods_zespolRealizacyjny.js", "validators.js"]
				},
				"stylesheets": {
					"files": ["style.css", "tablesorter.css", "tablesorter.less"]
				},
				"workflows": {
					"files": ["loading.html"],
					"dirs": {
						"errors": {
							"files": ["access_denied.html", "access_denied2.html", "errors.html", "errors.js", "not_found.html"]
						},
						"header": {
							"files": ["header.html", "header.js"]
						},
						"menus": {
							"files": ["menu.html", "menu.js", "submenu.html", "submenu.js"]
						},
						"modal": {
							"files": ["modal.html", "modal.js"]
						},
						"pagination": {
							"files": ["pagination_buttons.html", "pagination_buttons.js"]
						}
					}
				},
				"views": {
					"dirs": {
						"account": {
							"files": ["activate_account.html", "activate_account.js", "answer_invitation.html", "answer_invitation.js", "czlonek_zwyczajny_form.html", "czlonek_zwyczajny_form.js", "doradca_form.html", "doradca_form.js", "edit_profile.html", "edit_profile.js", "forgotten_password_form.html", "forgotten_password_form.js", "login_form.html", "login_form.js", "login_form_top.html", "login_form_top.js", "manage_account.html", "manage_account.js", "manage_buttons.html", "manage_buttons.js", "register_form.html", "register_form.js", "reset_password.html", "reset_password.js"]
						},
						"archiwum": {
							"files": ["archiwum_main.html", "archiwum_main.js"],
							"dirs": {
								"hibernowane": {
									"files": ["hibernowane.html", "hibernowane.js"]
								},
								"kosz": {
									"files": ["kosz.html", "kosz.js"]
								}
							}
						},
						"głosowanie": {
							"files": ["glosowanie.html", "glosowanie.js"]
						},
						"layout": {
							"files": ["layout.html", "layout.js", "mainpage.html", "mainpage.js", "map.html", "map.js"]
						},
						"powiadomienia": {
							"files": ["notification_info.html", "notification_info.js", "notification_list.html", "notification_list.js"]
						},
						"raporty": {
							"files": ["list_raport.html", "list_raport.js", "raport_info.html", "raport_info.js"]
						},
						"realizacja": {
							"files": ["realizacja.html", "realizacja.js", "realizacja_main.html", "realizacja_main.js", "zrealizowane.html", "zrealizowane.js"]
						},
						"ustawienia": {
							"files": ["ustawienia_main.html", "ustawienia_main.js"],
							"dirs": {
								"parametry": {
									"files": ["edit_parametr_modal.html", "edit_parametr_modal.js", "list_parametr.html", "list_parametr.js"]
								},
								"profile": {
									"files": ["profile_list.html", "profile_list.js", "sendMessage.html", "sendMessage.js"]
								},
								"zgloszenieCzlonkow": {
									"files": ["add_honorowy.html", "add_honorowy.js"]
								}
							}
						},
						"admin": {
							"dirs": {
								"jezyki": {
									"files": ["add_language.html", "add_language.js", "editLanguage.js", "edit_language.html", "list_languages.html", "list_languages.js"]
								}
							}
						},
						"kwestie": {
							"dirs": {
								"dyskusja": {
									"files": ["add_realization_modal.html", "add_realization_modal.js", "dyskusja_main.html", "dyskusja_main.js", "dyskusja_post.html", "dyskusja_post.js", "uzasadnienie_deliberacja_modal.html", "uzasadnienie_deliberacja_modal.js", "uzasadnienie_kosz_modal.html", "uzasadnienie_kosz_modal.js"]
								},
								"kwestia_crud": {
									"files": ["add_kwestia.html", "add_kwestia.js", "add_topic_modal.html", "add_topic_modal.js", "add_type_modal.html", "add_type_modal.js", "choose_topic_modal.html", "choose_topic_modal.js", "choose_type_modal.html", "choose_type_modal.js", "info_kwestia_details.html", "info_kwestia_details.js", "info_kwestia_manage_priorities.html", "info_kwestia_manage_priorities.js", "info_kwestia_manage_ZR.html", "info_kwestia_manage_ZR.js", "info_kwestia_top_buttons.html", "info_kwestia_top_buttons.js", "info_kwestia_user.html", "info_kwestia_user.js", "list_kwestia.html", "list_kwestia.js", "preview_kwestia.html", "preview_kwestia.js"]
								},
								"opcje_crud": {
									"files": ["add_kwestia_opcja.html", "add_kwestia_opcja.js", "opcje_list.html", "opcje_list.js", "preview_kwestia_opcja.html", "preview_kwestia_opcja.js"]
								},
								"zespol_realizacyjny": {
									"files": ["add_nazwa_zr.html", "add_nazwa_zr.js", "decyzja_modal.html", "decyzja_modal.js", "list_zr.html", "list_zr.js", "przyjmij_zespol.html", "przyjmij_zespol.js", "zr_current_issue_my_resloutions_modal.html", "zr_current_issue_my_resloutions_modal.js"]
								}
							}
						}
					}
				}
			}
		},
		"i18n": {
			"files": ["cz.i18n.json", "de.i18n.json", "en.i18n.js", "en.i18n.json", "fr.i18n.js", "fr.i18n.json", "pl.i18n.js", "pl.i18n.json"]
		},
		"lib": {
			"files": ["bothside_methods.js", "constants.js", "router.js"],
			"dirs": {
				"collections": {
					"files": ["emailErrors.js", "kwestia.js", "languages.js", "message.js", "parametr.js", "parametrDraft.js", "posts.js", "powiadomienie.js", "raport.js", "rodzaj.js", "subroles.js", "system.js", "temat.js", "users.js", "usersDraft.js", "zespol_realizacyjny.js", "zespol_realizacyjnyDraft.js"]
				}
			}
		},
		"private": {
			"files": ["email_act.html", "email_added_issue.html", "email_application_accepted.html", "email_application_accepted_existing_user.html", "email_application_confirmation.html", "email_application_rejected.html", "email_honorowy_invitation.html", "email_lobbing_issue.html", "email_login_data.html", "email_new_message.html", "email_no_realization_report.html", "email_reset_password.html", "email_started_voting.html"]
		},
		"server": {
			"files": ["config.js", "cronJobs.js", "publications.js", "smtp.js"],
			"dirs": {
				"initializers": {
					"files": ["admin_initializer.js", "languages_initializer.js", "parameter_initializer.js", "rodzaj_initializer.js", "system_initializer.js", "temat_initializer.js", "zespolRealizacyjny_initializer.js"]
				},
				"methods": {
					"files": ["emailError.js", "emails.js", "kwestia.js", "languages.js", "parametr.js", "parametrDraft.js", "posts.js", "powiadomienie.js", "raport.js", "rodzaj.js", "system.js", "temat.js", "users.js", "usersDraft.js", "zespolRealizacyjny.js", "zespolRealizacyjnyDraft.js"]
				},
				"observer": {
					"files": ["kwestiaObserver.js", "postyObserver.js", "zespolObserver.js"]
				}
			}
		},
		"packages": {
			"dirs": {
				"meteor-accounts-admin-ui-bootstrap-3": {
					"files": ["package.js", "README.md", "versions.json"],
					"dirs": {
						"client": {
							"files": ["accounts_admin.html", "accounts_admin.js", "delete_account_modal.html", "delete_account_modal.js", "info_account_modal.html", "info_account_modal.js", "startup.js", "update_account_modal.html", "update_account_modal.js", "update_roles_modal.html", "update_roles_modal.js"]
						},
						"libs": {
							"files": ["user_query.js"]
						},
						"server": {
							"files": ["methods.js", "publish.js", "startup.js"]
						},
						"style": {
							"files": ["style.css"]
						}
					}
				},
				"meteor-accounts-ui-bootstrap-3": {
					"files": ["accounts_ui.js", "accounts_ui.styl", "login_buttons.html", "login_buttons.js", "login_buttons_dialogs.html", "login_buttons_dialogs.js", "login_buttons_dropdown.html", "login_buttons_dropdown.js", "login_buttons_session.js", "login_buttons_single.html", "login_buttons_single.js", "package.js", "README.md", "versions.json"]
				},
				"meteor-global-notifications-master": {
					"files": ["notifications-tests.js", "notifications.html", "notifications.js", "notifications.less", "package.js", "README.md", "versions.json"]
				},
				"meteor-spin": {
					"files": ["package.js", "README.md"],
					"dirs": {
						"lib": {
							"files": ["spinner.css", "spinner.html", "spinner.js"]
						}
					}
				},
				"meteor-bootstrap-3": {
					"dirs": {
						"meteor-bootstrap-3": {
							"files": ["bootstrap-override.css", "package.js", "README.md", "update.sh"],
							"dirs": {
								"bootstrap-3": {
									"dirs": {
										"css": {
											"files": ["bootstrap-theme.css", "bootstrap.css"]
										},
										"js": {
											"files": ["bootstrap.js"]
										}
									}
								}
							}
						}
					}
				},
				"meteor-roles": {
					"dirs": {
						"docs": {
							"files": ["api.js", "data.json", "index.html"],
							"dirs": {
								"assets": {
									"files": ["index.html"],
									"dirs": {
										"css": {
											"files": ["main.css"]
										},
										"js": {
											"files": ["api-filter.js", "api-list.js", "api-search.js", "apidocs.js", "yui-prettify.js"]
										},
										"vendor": {
											"dirs": {
												"prettify": {
													"files": ["CHANGES.html", "prettify-min.css", "prettify-min.js", "README.html"]
												}
											}
										}
									}
								},
								"classes": {
									"files": ["index.html", "Roles.html", "UIHelpers.html"]
								},
								"files": {
									"files": ["index.html", "roles_roles_client.js.html", "roles_roles_common.js.html", "roles_roles_server.js.html"]
								},
								"modules": {
									"files": ["index.html", "Roles.html", "UIHelpers.html"]
								}
							}
						},
						"roles": {
							"files": ["package.js", "roles_client.js", "roles_common.js", "roles_server.js", "smart.json", "versions.json"],
							"dirs": {
								"tests": {
									"files": ["client.js", "server.js"]
								}
							}
						},
						"examples": {
							"dirs": {
								"mini-pages": {
									"files": ["model.js", "polyfills.js", "smart.json"],
									"dirs": {
										"client": {
											"files": ["client.js", "example.css", "example.html", "routing.js"],
											"dirs": {
												"lib": {
													"files": ["globals.js"]
												}
											}
										},
										"server": {
											"files": ["server.js"]
										}
									}
								},
								"router": {
									"files": ["model.js", "polyfills.js", "smart.json"],
									"dirs": {
										"client": {
											"files": ["client.js", "example.css", "example.html", "routing.js"],
											"dirs": {
												"lib": {
													"files": ["globals.js"]
												}
											}
										},
										"server": {
											"files": ["server.js"]
										}
									}
								},
								"iron-router": {
									"dirs": {
										"client": {
											"dirs": {
												"lib": {
													"files": ["globals.js"]
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};