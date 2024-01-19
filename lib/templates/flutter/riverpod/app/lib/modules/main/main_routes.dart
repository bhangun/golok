import 'package:go_router/go_router.dart';

import '../../utils/routes.dart';
import '../../pages/about.dart';
import '../dashboard/pages/dashboard.dart';

class MainRoutes {
  MainRoutes._();
  static String main = '/';
  static String login = '/login';
  static String home = '/dashboard';
  static String splash = '/splash';
  static String about = '/about';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.pageFadeTrans(home, const DashboardPage()),
    Routes.pageFadeTrans(about, AboutPage())
  ];
}
