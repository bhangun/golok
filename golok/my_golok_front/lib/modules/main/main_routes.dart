import 'package:go_router/go_router.dart';

import 'pages/home.dart';
import 'pages/main_page.dart';
import '../../utils/routes.dart';
import 'pages/about.dart';
import 'pages/settings.dart';

class MainRoutes {
  MainRoutes._();
  static String main = '/';
  static String login = '/login';
  static String setting = '/setting';
  static String splash = '/splash';
  static String about = '/about';

  static final List<GoRoute> goroutes = <GoRoute>[
    Routes.pageFadeTrans(main, const MainPage(child: HomePage(),)),
    Routes.pageFadeTrans(about, const AboutPage()),
    Routes.pageFadeTrans(setting, const SettingsPage()),
    Routes.pageFadeTrans(about, const AboutPage()),
  ];
}
