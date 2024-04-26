import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/price_list.dart';
import '../pages/price_detail.dart';
import '../pages/price_form.dart';

class PriceRoutes {

  PriceRoutes._();

  static const String priceList = '/priceList';
  static const String priceDetail = '/priceDetail';
  static const String priceForm = '/priceForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(priceList, PriceList()),
    Routes.page(priceDetail, PriceDetail()),
    Routes.page(priceForm, PriceForm()),
  ];
}

