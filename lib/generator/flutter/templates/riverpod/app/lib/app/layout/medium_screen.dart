import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/modules/menu.dart';
import '../../shared/widgets/side_menu/side_menu_fold.dart';

class MediumScreen extends StatefulWidget {
  final Widget? title;
  final List<Widget> actions;
  final Widget? body;
  final int currentIndex;
  final List<Menu> menuItems;
  final ValueChanged<int>? onFoldMenuTap;
  final ValueChanged<int>? onBottomTap;
  final ValueChanged<Menu>? onMenuClick;
  final FloatingActionButton? floatingActionButton;

  const MediumScreen(
      {this.title,
      this.body,
      required this.actions,
      required this.currentIndex,
      required this.menuItems,
      this.onMenuClick,
      this.onBottomTap,
      this.floatingActionButton,
      this.onFoldMenuTap,
      super.key});

  @override
  State<MediumScreen> createState() => _MediumScreenState();
}

class _MediumScreenState extends State<MediumScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const Text('icon'),
        title: widget.title,
        actions: widget.actions,
      ),
      body: Row(
        children: [
          // Side Menu
          SideMenuFold(
            menuItems: widget.menuItems,
            currentIndex: widget.currentIndex,
            onMenuClick: onMenuClick,
          ),

          // Divider
          verticalDivider(),

          // Main Section
          Expanded(
            child: widget.body!,
          ),
        ],
      ),
    );
  }

  Widget verticalDivider() => VerticalDivider(
        width: 1,
        thickness: 1,
        color: Theme.of(context).dividerColor,
      );

  void onMenuClick(Menu menu) {
    context.go(menu.path!);
  }
}
