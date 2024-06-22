import 'package:flutter/material.dart';

import '../../models/menu.dart';
import '../../modules/register_modules.dart';
import '../routes.dart';

class ModulesRegistry {
  // singleton object
  static final ModulesRegistry _singleton = ModulesRegistry._();

  // factory method to return the same object each time its needed
  factory ModulesRegistry() => _singleton;

  ModulesRegistry._();
  static List<Menu> menus = [];

  static List<Menu> routes(BuildContext context) {
    return registerPages(context);
  }


  static goroutes() {
    modulesGoroutes().forEach((m) {
      Routes.addRoutes(m);
    });
  }

  static branches() {
    modulesBranches().forEach((m) {
      Routes.addBranches(m);
    });
  }
}

