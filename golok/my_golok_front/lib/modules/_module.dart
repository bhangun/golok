import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import '_routes.dart';
import 'services/_services.dart';

class Module implements Module {
  @override
  String? name = '';

  @override
  pages() {
    return [
      Menu(title: ' Detail', path: Routes.Detail),
      Menu(title: ' Form', path: Routes.Form),
      Menu(
          title: ' List',
          path: Routes.List,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => Routes.goroutes;

  @override
  String? baseRoute = '';
}
