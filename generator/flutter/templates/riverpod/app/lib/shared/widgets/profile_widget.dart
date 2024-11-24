import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/utils/constants.dart';
import 'dropdown_widget.dart';

class ProfileCard extends ConsumerWidget {
  const ProfileCard(
      {super.key,
      required this.accountName,
      this.onTap,
      this.imagePath = 'assets/images/profile.png'});
  final String accountName;
  final String imagePath;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    List<DropdownItem> profileMenu = [
      DropdownItem(
          title: accountName, icon: "list", onTap: () => print('list')),
      DropdownItem(title: "Sign out", icon: "home", onTap: onTap)
    ];
    return Container(
        margin: const EdgeInsets.only(left: defaultPadding),
        padding: const EdgeInsets.symmetric(
          horizontal: defaultPadding,
          vertical: defaultPadding / 2,
        ),
        decoration: BoxDecoration(
          borderRadius: const BorderRadius.all(Radius.circular(10)),
          border: Border.all(color: Colors.white10),
        ),
        child: Dropdown(
          items: profileMenu,
        ));
  }
}
