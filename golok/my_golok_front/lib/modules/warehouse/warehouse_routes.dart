import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/warehouse_list.dart';
import '../pages/warehouse_detail.dart';
import '../pages/warehouse_form.dart';

class WarehouseRoutes {

  WarehouseRoutes._();

  static const String warehouseList = '/warehouseList';
  static const String warehouseDetail = '/warehouseDetail';
  static const String warehouseForm = '/warehouseForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(warehouseList, WarehouseList()),
    Routes.page(warehouseDetail, WarehouseDetail()),
    Routes.page(warehouseForm, WarehouseForm()),
  ];
}

