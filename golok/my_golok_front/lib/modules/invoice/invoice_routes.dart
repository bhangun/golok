import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/invoice_list.dart';
import '../pages/invoice_detail.dart';
import '../pages/invoice_form.dart';

class InvoiceRoutes {

  InvoiceRoutes._();

  static const String invoiceList = '/invoiceList';
  static const String invoiceDetail = '/invoiceDetail';
  static const String invoiceForm = '/invoiceForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(invoiceList, InvoiceList()),
    Routes.page(invoiceDetail, InvoiceDetail()),
    Routes.page(invoiceForm, InvoiceForm()),
  ];
}

