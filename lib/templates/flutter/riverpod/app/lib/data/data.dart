// import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../../utils/modules/menu.dart';

var header = {"title": "", "logo": "assets/images/logo.png"};

List<Menu> menu(BuildContext context) => [
      Menu(
        title: AppLocalizations.of(context)!.dashboard,
        icon: "list",
        path: "/dashboard",
      ),
      Menu(
          title: AppLocalizations.of(context)!.users,
          icon: "home",
          path: "/users",
          items: const [
            Menu(title: "Users", icon: "home", path: "/users"),
            Menu(title: "Assets", icon: "home", path: "/dashboard")
          ]),
      Menu(
          title: AppLocalizations.of(context)!.settings,
          icon: "home",
          path: "/settings",
          items: const [
            Menu(title: "Events", icon: "home", path: "/dashboard"),
            Menu(title: "Assets", icon: "home", path: "/dashboard")
          ]),
      Menu(
        title: AppLocalizations.of(context)!.about,
        icon: "home",
        path: "/about",
      ),
    ];

