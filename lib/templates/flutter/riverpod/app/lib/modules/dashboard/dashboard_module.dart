import 'package:flutter/widgets.dart';

import '../../models/menu.dart';
import '../../utils/modules/module_model.dart';
import 'dashboard_routes.dart';


class DashboardModule implements Module {

  @override
  String? name = 'Dashboard';

  @override
  String? baseRoute = '/dashboard';

  @override
  pages(BuildContext context) => [
        Menu(title: '', path: DashboardRoutes.dashboard),
      ];

  @override
  services() {}

  @override
  goroutes() => DashboardRoutes.goroutes;
}
