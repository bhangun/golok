import 'package:flutter/widgets.dart';

import '../../modules/register_modules.dart';
import '../routes.dart';
import 'modules.dart';

class ModulesRegistry {
  // singleton object
  static final ModulesRegistry _singleton = ModulesRegistry._();

  // factory method to return the same object each time its needed
  factory ModulesRegistry() => _singleton;

  ModulesRegistry._();

  static routes() {
    registerModules().forEach((m) {
      Routes.addRoutes(m.goroutes());
      m.services();
    });
  }

  static pages(BuildContext context) {
    registerModules().forEach((m) {
      m.pages(context).forEach((p) {
        Modules.addPages(p);
      });
    });
  }
}
