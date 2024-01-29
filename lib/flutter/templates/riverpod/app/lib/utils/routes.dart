import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../modules/main/main_routes.dart';
import '../widgets/transitions/fade_transition.dart';


class Routes {
  static final Routes _singleton = Routes._();
  Routes._();

  factory Routes() => _singleton;

  static final List<RouteBase> _goroutes = [];

  static get instance async {
    _goroutes.addAll(MainRoutes.goroutes);
    return _singleton;
  }

  static get routes => _goroutes;

  static addRoutes(List<GoRoute> newRoutes) {
    _goroutes.addAll(newRoutes);
  }

  static GoRouter config(
          {WidgetRef? ref,
          String? initial,
          bool debugLog = true,
          bool isLoggedIn = true}) =>
      GoRouter(
        navigatorKey: GlobalKey<NavigatorState>(),
        initialLocation: initial,
        routes: _goroutes,
        debugLogDiagnostics: debugLog,
        // redirect to the login page if the user is not logged in
        //redirect: (BuildContext context, GoRouterState state) {
          //
          //ref!.watch(authBloc.select((value) => value.loggedIn));

          // if the user is not logged in, they need to login
          //final bool loggedIn = isLoggedIn;
          // final bool loggedIn = state.subloc == MainRoutes.login;
         /*  if (!loggedIn) {
            return MainRoutes.login;
          } */

          // if the user is logged in but still on the login page, send them to
          // the home page
          /*  if (loggedIn && state.subloc != '/') {
            return state.subloc;
          } else {
            return MainRoutes.home;
          } */
       // },

        // changes on the listenable will cause the router to refresh it's route
        //refreshListenable: _loginInfo,
      );

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
