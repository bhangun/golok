import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'product_routes.dart';
import 'services/product_services.dart';

class ProductModule implements Module {
  @override
  String? name = 'Product';

  @override
  pages() {
    return [
      Menu(title: 'Product Detail', path: ProductRoutes.productDetail),
      Menu(title: 'Product Form', path: ProductRoutes.productForm),
      Menu(
          title: 'Product List',
          path: ProductRoutes.productList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => ProductRoutes.goroutes;

  @override
  String? baseRoute = '';
}
