import 'package:adaptive_screen/adaptive_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:kayys_components/models/menu.dart';
import 'package:syirkah/app/layout/large_screen.dart';
import 'package:syirkah/app/layout/medium_screen.dart';
import 'package:syirkah/app/layout/phone_screen.dart';

import '../../core/modules/modules_registry.dart';

class MainLayoutScreen extends ConsumerStatefulWidget {
  const MainLayoutScreen({super.key, required this.navigationShell});
  final StatefulNavigationShell navigationShell;
  @override
  ConsumerState<MainLayoutScreen> createState() => _MainLayoutScreenState();
}

class _MainLayoutScreenState extends ConsumerState<MainLayoutScreen> {
  var valueCart = 0;
  var valueNotif = 0;
  List<Menu> menuItems = [];

  @override
  Widget build(BuildContext context) {
    menuItems = ModulesRegistry.routes(context);
    return SafeArea(
        child: AdaptiveScreen(
            // If fit large screen (Desktop)
            largeScreen: LargeScreen(
              body: widget.navigationShell,
              menuItems: menuItems,
            ),

            // If fit medium screen (Tablet)
            mediumScreen: MediumScreen(
              body: widget.navigationShell,
              menuItems: menuItems,
            ),

            // If fit small screen (Phone)
            phone: PhoneScreen(
              menuItems: menuItems,
              body: widget.navigationShell,
            )));
  }
}
