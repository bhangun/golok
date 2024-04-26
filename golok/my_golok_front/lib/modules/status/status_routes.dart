import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/status_list.dart';
import '../pages/status_detail.dart';
import '../pages/status_form.dart';

class StatusRoutes {

  StatusRoutes._();

  static const String statusList = '/statusList';
  static const String statusDetail = '/statusDetail';
  static const String statusForm = '/statusForm';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(statusList, StatusList()),
    Routes.page(statusDetail, StatusDetail()),
    Routes.page(statusForm, StatusForm()),
  ];
}

