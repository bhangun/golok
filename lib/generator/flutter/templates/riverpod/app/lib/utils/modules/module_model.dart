import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../models/menu.dart';

abstract class Module {
  String? name;
  List<Menu> pages(BuildContext context);
  void services();
  List<GoRoute> goroutes();
  List<StatefulShellBranch> branches();
}
