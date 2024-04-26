import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'warehouse_routes.dart';
import 'services/warehouse_services.dart';

class WarehouseModule implements Module {
  @override
  String? name = 'Warehouse';

  @override
  pages() {
    return [
      Menu(title: 'Warehouse Detail', path: WarehouseRoutes.warehouseDetail),
      Menu(title: 'Warehouse Form', path: WarehouseRoutes.warehouseForm),
      Menu(
          title: 'Warehouse List',
          path: WarehouseRoutes.warehouseList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => WarehouseRoutes.goroutes;

  @override
  String? baseRoute = '';
}
