import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/inventory_list.dart';
import '../pages/inventory_detail.dart';
import '../pages/inventory_form.dart';

class InventoryRoutes {

  InventoryRoutes._();

  static const String inventoryList = '/inventoryList';
  static const String inventoryDetail = '/inventoryDetail';
  static const String inventoryForm = '/inventoryForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(inventoryList, InventoryList()),
    Routes.page(inventoryDetail, InventoryDetail()),
    Routes.page(inventoryForm, InventoryForm()),
  ];
}

