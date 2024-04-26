import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../../models/menu.dart';
import 'main_routes.dart';
import '../../utils/modules/module_model.dart';

class MainModule implements Module {
  @override
  String? name = 'Apps';

  @override
  String? baseRoute = '/';

  @override
  pages(BuildContext context) => [
        Menu(title: AppLocalizations.of(context)!.home, path: MainRoutes.main),
        Menu(
            title: AppLocalizations.of(context)!.about, path: MainRoutes.about),
        Menu(
            title: AppLocalizations.of(context)!.settings,
            path: MainRoutes.setting),
      ];

  @override
  services() {}

  @override
  goroutes() => MainRoutes.goroutes;
}
