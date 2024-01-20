import 'package:awesome_bottom_bar/awesome_bottom_bar.dart';
import 'package:awesome_bottom_bar/widgets/inspired/inspired.dart';
import 'package:flutter/material.dart';

import '../utils/config.dart';
import '../utils/constants.dart';
import '../utils/helper.dart';
import '../utils/modules/menu.dart';
import '../widgets/side_menu/side_menu.dart';

class PhoneScreen extends StatefulWidget {
  final Widget? floatingActionButton;
  final List<Menu>? menuItems;
  final ValueChanged<Menu>? onMenuClick;
  final void Function(int)? onBottomTap;
  final int? currentIndex;
  final Widget? title;
  final double? width;
  final String? image;
  final Widget? body;
  //final Widget? drawer;
  final List<Widget>? actions;

  const PhoneScreen(
      {Key? key,
      this.floatingActionButton,
      required this.menuItems,
      this.onBottomTap,
      this.onMenuClick,
      this.currentIndex,
      this.title,
      this.width,
      this.image,
     // this.drawer,
      this.body,
      this.actions})
      : super(key: key);
  

  @override
  State<PhoneScreen> createState() => _PhoneScreenState();
}

class _PhoneScreenState extends State<PhoneScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.body,
      //drawer: widget.drawer,
      drawer: SideMenu(
            width: sideMenuWidth,
            image: imageSplash,
            menuItems: widget.menuItems,
            currentIndex: widget.currentIndex,
            title: widget.title,
            onMenuClick: widget.onMenuClick),
      appBar: AppBar(
        // leading: const Icon(Icons.cabin),
        title: widget.title,
        backgroundColor: Theme.of(context).colorScheme.primary,

        // actions: widget.actions,
      ),
      bottomNavigationBar: BottomBarInspiredOutside(
        curve: Curves.easeInOut,
        elevation: 5,
        items: const <TabItem>[
          TabItem(icon: Icons.home, title: ''),
          TabItem(icon: Icons.access_alarms_sharp, title: ''),
          TabItem(icon: Icons.account_circle_outlined, title: ''),
          TabItem(icon: Icons.home, title: ''),
          TabItem(icon: Icons.access_alarms_sharp, title: ''),
        ],
        backgroundColor: Theme.of(context).colorScheme.primary,
        height: 30,
        color: Theme.of(context).colorScheme.onBackground,
        colorSelected: Theme.of(context).colorScheme.onBackground,
        indexSelected: widget.currentIndex!,
        onTap: widget.onBottomTap,
        itemStyle: ItemStyle.circle,
        animated: true,
        chipStyle: ChipStyle(
            notchSmoothness: NotchSmoothness.verySmoothEdge,
            background: Theme.of(context).colorScheme.primary),
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
        currentIndex: widget.currentIndex!,
        onTap: widget.onBottomTap,
      );
}
