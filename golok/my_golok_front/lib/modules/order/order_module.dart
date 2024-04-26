import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'order_routes.dart';
import 'services/order_services.dart';

class OrderModule implements Module {
  @override
  String? name = 'Order';

  @override
  pages() {
    return [
      Menu(title: 'Order Detail', path: OrderRoutes.orderDetail),
      Menu(title: 'Order Form', path: OrderRoutes.orderForm),
      Menu(
          title: 'Order List',
          path: OrderRoutes.orderList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => OrderRoutes.goroutes;

  @override
  String? baseRoute = '';
}
