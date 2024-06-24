import 'package:flutter/material.dart';

import '../../utils/helper.dart';
import '../../models/menu.dart';

class SideMenuFold extends StatelessWidget {
  const SideMenuFold(
      {super.key,
      this.floatingActionButton,
      required this.menuItems,
      this.onMenuClick,
      this.currentIndex});
  final Widget? floatingActionButton;
  final List<Menu>? menuItems;
  final void Function(Menu)? onMenuClick;
  final int? currentIndex;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: NavigationRail(
      minWidth: 50,
      minExtendedWidth: 70,
      leading: floatingActionButton,
      destinations: [
        ...menuItems!.map(
          (d) => NavigationRailDestination(
            icon: getIcon(d.icon??'home'),
            label: Text(d.title!),
          ),
        ),
      ],
      selectedIndex: currentIndex,
      onDestinationSelected: (index) => onMenuClick!(menuItems![index]), 
    ));
  }
}