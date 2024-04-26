import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'price_routes.dart';
import 'services/price_services.dart';

class PriceModule implements Module {
  @override
  String? name = 'Price';

  @override
  pages() {
    return [
      Menu(title: 'Price Detail', path: PriceRoutes.priceDetail),
      Menu(title: 'Price Form', path: PriceRoutes.priceForm),
      Menu(
          title: 'Price List',
          path: PriceRoutes.priceList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => PriceRoutes.goroutes;

  @override
  String? baseRoute = '';
}
