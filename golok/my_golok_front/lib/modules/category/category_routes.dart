import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/category_list.dart';
import '../pages/category_detail.dart';
import '../pages/category_form.dart';

class CategoryRoutes {

  CategoryRoutes._();

  static const String categoryList = '/categoryList';
  static const String categoryDetail = '/categoryDetail';
  static const String categoryForm = '/categoryForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(categoryList, CategoryList()),
    Routes.page(categoryDetail, CategoryDetail()),
    Routes.page(categoryForm, CategoryForm()),
  ];
}

