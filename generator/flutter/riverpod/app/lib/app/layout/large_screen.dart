import 'package:flutter/material.dart';

import '../../core/modules/menu.dart';
import '../../core/utils/config.dart';
import '../../core/utils/constants.dart';
import '../../shared/widgets/side_menu/side_menu.dart';


class LargeScreen extends StatefulWidget {
  final Widget? body;
  final List<Menu> menuItems;
  const LargeScreen({
    super.key,
    required this.body,
    required this.menuItems,
  });

  @override
  State<LargeScreen> createState() => _LargeScreenState();
}

class _LargeScreenState extends State<LargeScreen> {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Side Menu
        SideMenu(
            width: sideMenuWidth,
            image: imageSplash,
            menuItems: widget.menuItems,
            /*  currentIndex: widget.currentIndex,
            title: widget.title, */
            onMenuClick: (val) {}),
        // Divider
        VerticalDivider(
          width: 2,
          thickness: 100,
          color: Theme.of(context).dividerColor,
        ),
        // Main Section
        Expanded(
          child: Scaffold(
            appBar: AppBar(
              //actions: widget.actions,
              backgroundColor: Theme.of(context).colorScheme.primary,
            ),
            body: widget.body,
          ),
        )
      ],
    );
  }
}
