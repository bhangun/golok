import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'inventory_routes.dart';
import 'services/inventory_services.dart';

class InventoryModule implements Module {
  @override
  String? name = 'Inventory';

  @override
  pages() {
    return [
      Menu(title: 'Inventory Detail', path: InventoryRoutes.inventoryDetail),
      Menu(title: 'Inventory Form', path: InventoryRoutes.inventoryForm),
      Menu(
          title: 'Inventory List',
          path: InventoryRoutes.inventoryList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => InventoryRoutes.goroutes;

  @override
  String? baseRoute = '';
}
