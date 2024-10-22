import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/app_module.dart';
import '../../app/layout/main_layout_screen.dart';
import '../../app/pages/home.dart';
import '../../app/pages/login.dart';
import '../../app/pages/splash.dart';
import '../../shared/widgets/error/error_404.dart';
import '../../shared/widgets/transitions/fade_transition.dart';


class Routes {
  static final Routes _singleton = Routes._();

  Routes._();

  factory Routes() => _singleton;

  static final List<RouteBase> _goroutes = [];

  static final List<StatefulShellBranch> _branches = [];

  static Future<Routes> get instance async {
    _goroutes.addAll(AppModule().goroutes());
    return _singleton;
  }

  static get routes => _goroutes;

  static List<StatefulShellBranch> get branches => _branches;

  static addRoutes(List<GoRoute> newRoutes) {
    _goroutes.addAll(newRoutes);
  }

  static addBranches(List<StatefulShellBranch> newBranches) {
    _branches.addAll(newBranches);
  }

  static GoRouter config(
      {WidgetRef? ref,
      String initial = '/splash',
      bool debugLog = true,
      bool isLoggedIn = true}) {

    return GoRouter(
      navigatorKey: GlobalKey<NavigatorState>(),
      initialLocation: initial,
      debugLogDiagnostics: debugLog,
      errorBuilder: (context, state) => NotFoundScreen(
        state: state,
      ),
      routes: [
        GoRoute(
          path: '/login',
          builder: (BuildContext context, GoRouterState state) =>
              const LoginPage(),
        ),
        GoRoute(
          path: '/splash',
          builder: (BuildContext context, GoRouterState state) =>
              const SplashScreen(),
        ),
        StatefulShellRoute.indexedStack(
            builder: (BuildContext context, GoRouterState state,
                StatefulNavigationShell navigationShell) {
              return MainLayoutScreen(navigationShell: navigationShell);
            },
            branches: [
              Routes.shellBranch('main', '/', const HomePage()),
              ..._branches
            ]),
        ..._goroutes,
      ],

    );
  }

  static shellBranch(String name, String path, Widget child,
      [List<RouteBase>? routes]) {
    GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
    return StatefulShellBranch(navigatorKey: navigatorKey, routes: [
      GoRoute(
          name: name,
          path: path,
          pageBuilder: (context, state) {
            return MaterialPage(child: child);
          },
          /* routes: routes! */),
    ]);
  }

  static GoRoute page(String path, Widget page) {
    return GoRoute(
      path: path,
      builder: (context, state) => page,
    );
  }

  static GoRoute pageNoTrans(String path, Widget page) {
    return GoRoute(
      path: path,
      pageBuilder: (context, state) => NoTransitionPage(
        child: page,
      ),
    );
  }

  static GoRoute pageFadeTrans(String path, Widget page) {
    return GoRoute(
      path: path,
      pageBuilder: (context, state) => FadeTransitionPage(child: page),
    );
  }
}
