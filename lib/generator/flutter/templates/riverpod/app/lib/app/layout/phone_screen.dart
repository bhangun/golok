import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/modules/menu.dart';
import '../../core/utils/config.dart';
import '../../core/utils/constants.dart';
import '../../core/utils/helper.dart';
import '../../shared/widgets/side_menu/side_menu.dart';


class PhoneScreen extends StatefulWidget {
  final Widget? floatingActionButton;
  final List<Menu>? menuItems;
  final ValueChanged<Menu>? onMenuClick;
  final void Function(int)? onBottomTap;
  final int currentIndex;
  final Widget title;
  final double? width;
  final String? image;
  final Widget? body;
  final List<Widget>? actions;

  const PhoneScreen(
      {super.key,
      this.floatingActionButton,
      required this.menuItems,
      this.onBottomTap,
      this.onMenuClick,
      this.currentIndex = 0,
      this.title = const Text(''),
      this.width,
      this.image,
      this.body,
      this.actions});

  @override
  State<PhoneScreen> createState() => _PhoneScreenState();
}

class _PhoneScreenState extends State<PhoneScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.body,
      drawer: SideMenu(
          width: sideMenuWidth,
          image: imageSplash,
          menuItems: widget.menuItems,
          currentIndex: widget.currentIndex,
          title: widget.title,
          onMenuClick: onMenuClick),
      appBar: AppBar(
        title: widget.title,
        backgroundColor: Theme.of(context).colorScheme.primary,
        actions: widget.actions,
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: ''),
          BottomNavigationBarItem(
              icon: Icon(Icons.access_alarms_sharp), label: ''),
          BottomNavigationBarItem(
              icon: Icon(Icons.account_circle_outlined), label: ''),
          BottomNavigationBarItem(icon: Icon(Icons.abc_rounded), label: ''),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.backpack,
              ),
              label: ''),
        ],
        backgroundColor: Theme.of(context).primaryColor,
        selectedItemColor: Theme.of(context).colorScheme.error,
        currentIndex: widget.currentIndex,
        onTap: widget.onBottomTap,
      ),
      floatingActionButton: widget.floatingActionButton,
    );
  }

  Widget bottomDefault() => BottomNavigationBar(
        items: [
          ...widget.menuItems!.map(
            (d) => BottomNavigationBarItem(
              icon: getIcon(d.icon!),
              label: d.title,
            ),
          ),
        ],
        currentIndex: widget.currentIndex,
        onTap: widget.onBottomTap,
      );

  void onMenuClick(Menu menu) {
    context.go(menu.path!);
    Navigator.pop(context);
  }
}
