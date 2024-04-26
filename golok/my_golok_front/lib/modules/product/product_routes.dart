import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/product_list.dart';
import '../pages/product_detail.dart';
import '../pages/product_form.dart';

class ProductRoutes {

  ProductRoutes._();

  static const String productList = '/productList';
  static const String productDetail = '/productDetail';
  static const String productForm = '/productForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(productList, ProductList()),
    Routes.page(productDetail, ProductDetail()),
    Routes.page(productForm, ProductForm()),
  ];
}

