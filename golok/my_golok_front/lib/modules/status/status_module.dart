import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'status_routes.dart';
import 'services/status_services.dart';

class StatusModule implements Module {
  @override
  String? name = 'Status';

  @override
  pages() {
    return [
      Menu(title: 'Status Detail', path: StatusRoutes.statusDetail),
      Menu(title: 'Status Form', path: StatusRoutes.statusForm),
      Menu(
          title: 'Status List',
          path: StatusRoutes.statusList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => StatusRoutes.goroutes;

  @override
  String? baseRoute = '';
}
