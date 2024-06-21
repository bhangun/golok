import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../modules/main/pages/home.dart';

import '../modules/auth/pages/login3.dart';
import '../modules/error/pages/error_404.dart';
import '../modules/main/main_module.dart';
import '../modules/main/pages/splash.dart';
import '../modules/syirkah/pages/syirkah_page.dart';
import '../widgets/transitions/fade_transition.dart';

class Routes {
  static final Routes _singleton = Routes._();

  Routes._();

  factory Routes() => _singleton;

  static final List<RouteBase> _goroutes = [];

  static final List<StatefulShellBranch> _branches = [];

  static Future<Routes> get instance async {
    _goroutes.addAll(MainModule().goroutes());
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
      String initial = '/',
      bool debugLog = true,
      bool isLoggedIn = true}) {
    //LoginState auth = ref!.watch(loginState);

    return GoRouter(
      navigatorKey: GlobalKey<NavigatorState>(),
      initialLocation: initial,
      debugLogDiagnostics: debugLog,
      errorBuilder: (context, state) => NotFoundScreen(
        state: state,
      ),
      //refreshListenable: ListenableBuilder(listenable: Listenable.merge(listenables), builder: builder),
      routes: [
        GoRoute(
          path: '/login',
          // onExit: (context) => !auth.isLoggedIn,
          builder: (BuildContext context, GoRouterState state) =>
              const LoginPage(),
          /* redirect: (BuildContext context, GoRouterState state) {
            LoginState auth = ref!.watch(loginState);
            if (auth.isLoggedIn) return MainModule.main;
            return MainModule.login;
          }, */
        ),
        GoRoute(
          path: '/splash',
          builder: (BuildContext context, GoRouterState state) =>
              const SplashScreen(),
          /* redirect: (BuildContext context, GoRouterState state) {
              
              if (auth.isLoggedIn) return MainModule.dashboard;
              return MainModule.login;} */
        ),
        StatefulShellRoute.indexedStack(
            builder: (BuildContext context, GoRouterState state,
                StatefulNavigationShell navigationShell) {
              return SyirkahPage(navigationShell: navigationShell);
            },
            branches: [
              Routes.shellBranch('syirkah', '/', const HomePage(), []),
              ..._branches
            ]),
        ..._goroutes,
      ],

      // changes on the listenable will cause the router to refresh it's route
      //refreshListenable: _loginInfo,
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
          routes: routes!),
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
