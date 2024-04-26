import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/order_list.dart';
import '../pages/order_detail.dart';
import '../pages/order_form.dart';

class OrderRoutes {

  OrderRoutes._();

  static const String orderList = '/orderList';
  static const String orderDetail = '/orderDetail';
  static const String orderForm = '/orderForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(orderList, OrderList()),
    Routes.page(orderDetail, OrderDetail()),
    Routes.page(orderForm, OrderForm()),
  ];
}

