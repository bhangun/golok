import 'package:flutter/widgets.dart';

import '../../utils/modules/module_model.dart';
import '../../models/menu.dart';
import 'invoice_routes.dart';
import 'services/invoice_services.dart';

class InvoiceModule implements Module {
  @override
  String? name = 'Invoice';

  @override
  pages() {
    return [
      Menu(title: 'Invoice Detail', path: InvoiceRoutes.invoiceDetail),
      Menu(title: 'Invoice Form', path: InvoiceRoutes.invoiceForm),
      Menu(
          title: 'Invoice List',
          path: InvoiceRoutes.invoiceList,
          showInDrawer: true,
          showInHome: true)
    ];
  }

  @override
  services() {}

  @override
  goroutes() => InvoiceRoutes.goroutes;

  @override
  String? baseRoute = '';
}
