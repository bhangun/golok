import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';

import '../../models/menu.dart';

abstract class Module {
  String? name;
  String? baseRoute;
  List<Menu> pages(BuildContext context);
  void services();
  List<GoRoute> goroutes();
}
