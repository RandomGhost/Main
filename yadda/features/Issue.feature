feature: Creation_issue

Scenario: Creation d'une issue avec du texte debile


	  Given je suis un utilisateur {RandomGhost}
	  When je clique sur {Accueil::Sign_in}
	  When je remplis le champ {Connexion::Login} avec {Global::User}
	  When je remplis le champ {Connexion::Pass} avec {Global::Pass}
	  When je fais un Screen {Connecte}
	  When je clique sur {Connexion::Sign_in}
	  When je fais un Screen {Connecte}
	  When je clique sur {Principal::Moi}
	  When je fais un Screen {Depot}
	  When je clique sur {Principal::Popular_repo::Depot!(Main)}
	  When je fais un Screen {Depot_selectionner}
	  When je clique sur {Depot::Task::Issue!(Main)}
	  When je fais un Screen {Issue}
	  When je clique sur {Depot::Issue::New_issue!(Main)}
	  When je remplis le champ {Depot::Issue::Title} avec {not!Trop marrant rr}
	  When je remplis le champ {Depot::Issue::Comment} avec {not!Tu trouve pas ca drole ?}
	  When je fais un Screen { Remplis }
	  When je clique sur {Depot::Issue::Submit_new}
	  When je fais un Screen {Finis}