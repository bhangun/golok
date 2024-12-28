import 'package:flutter/material.dart';

class UserAccountsDrawer extends StatelessWidget {
  final String? accountName;
  final String? accountEmail;
  final String? imgPath;
  const UserAccountsDrawer({this.accountEmail, this.accountName, this.imgPath, Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return UserAccountsDrawerHeader(
      accountName: Text(
        accountName!,
      ),
      accountEmail: Text(
        accountEmail!,
      ),
      currentAccountPicture: CircleAvatar(
        backgroundImage: AssetImage(imgPath!),
      ),
    );
  }
}
