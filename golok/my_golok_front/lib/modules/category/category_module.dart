import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'category_routes.dart';
import 'services/category_services.dart';

class CategoryModule implements Module {
  @override
  String? name = 'Category';

  @override
  pages() {
    return [
      Menu(title: 'Category Detail', path: CategoryRoutes.categoryDetail),
      Menu(title: 'Category Form', path: CategoryRoutes.categoryForm),
      Menu(
          title: 'Category List',
          path: CategoryRoutes.categoryList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => CategoryRoutes.goroutes;

  @override
  String? baseRoute = '';
}
