import 'package:flutter/material.dart';

import '../utils/configuration/config.dart';
import '../utils/configuration/constants.dart';
import '../models/menu.dart';
import '../widgets/side_menu/side_menu.dart';

class LargeScreen extends StatefulWidget {
  final Widget? title;
  final List<Widget> actions;
  final Widget? body;
  final int currentIndex;
  final List<Menu> menuItems;
  final ValueChanged<int>? onFoldMenuTap;
  final ValueChanged<int>? onBottomTap;
  final ValueChanged<Menu>? onMenuClick;
  final FloatingActionButton? floatingActionButton;

  const LargeScreen(
      {this.title,
      this.body,
      required this.actions,
      required this.currentIndex,
      required this.menuItems,
      this.onMenuClick,
      this.onBottomTap,
      this.floatingActionButton,
      this.onFoldMenuTap,
      Key? key})
      : super(key: key);

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
              currentIndex: widget.currentIndex,
              title: widget.title,
              onMenuClick: widget.onMenuClick),

          // Divider
          verticalDivider(),

          // Main Section
          Expanded(
            child: Scaffold(
              appBar: AppBar(
                actions: widget.actions,
                backgroundColor: Theme.of(context).colorScheme.primary,
              ),
              body: widget.body,
              floatingActionButton: widget.floatingActionButton,
            ),
          )
        ],
      );
  }

  Widget verticalDivider() => VerticalDivider(
        width: 1,
        thickness: 1,
        color: Theme.of(context).dividerColor,
      );
}