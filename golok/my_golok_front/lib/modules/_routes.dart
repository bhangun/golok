import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../pages/_list.dart';
import '../pages/_detail.dart';
import '../pages/_form.dart';

class Routes {

  Routes._();

  static const String List = '/List';
  static const String Detail = '/Detail';
  static const String Form = '/Form';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.page(List, List()),
    Routes.page(Detail, Detail()),
    Routes.page(Form, Form()),
  ];
}

