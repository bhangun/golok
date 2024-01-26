import 'package:flutter/widgets.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../../models/menu.dart';
import '../../utils/modules/module_model.dart';
import 'user_routes.dart';

class UserModule implements Module {
  @override
  String? name = 'User';

  @override
  pages(BuildContext context) => [
       Menu(
          title: AppLocalizations.of(context)!.users,
          icon: "home",
          path: "/users",
          items:  [
            Menu(title: "Users", icon: "home", path: UserRoutes.users),
            Menu(title: "Detail", icon: "home", path: UserRoutes.detail)
          ]),
    ];

  @override
  String? baseRoute = '/users';

  @override
  services() {}

  @override
  goroutes() => UserRoutes.goroutes;

}
