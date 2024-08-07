import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../logic/user_logic.dart';

class UserDetailPage extends ConsumerStatefulWidget {
  final String? id;
  const UserDetailPage({super.key, this.id});
  
  @override
  ConsumerState<ConsumerStatefulWidget> createState()  => _UserDetailPageState();
}

class _UserDetailPageState extends ConsumerState<UserDetailPage> {
  UserBloc _userBloc = UserBloc();

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
   _userBloc = ref.watch(userBloc);
   
    return Scaffold(
            appBar: AppBar(title:  Text('User Detail ${widget.id}')),
            body: _userBloc.isItemEmpty
                ? const Center(child: Text('User data are empty'))
                : UserDetailPage(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _userBloc.update(),
              tooltip: 'Edit',
              child: const Icon(Icons.edit),
            ));
  }

  UserDetailPage() {
    return ListView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        children: <Widget>[
          const SizedBox(height: 100.0),
          Icon(Icons.person, size: 100, color: Colors.blue[500]),
          Column(children: <Widget>[
            Text(_userBloc.user!.login!),
            Text(_userBloc.user!.firstName!),
            Text(_userBloc.user!.lastName!),
            Text(_userBloc.user!.email!),
            Text(_userBloc.user!.password!),
            Text(_userBloc.user!.phone!),
            //Text(_userBloc.user!.userStatus!),
          ])
        ]);
  }
}