import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../bloc/user_bloc.dart';
import '../models/user.dart';

class UserListPage extends ConsumerStatefulWidget {
  const UserListPage({Key? key}) : super(key: key);

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _UserListPageState();
}

class _UserListPageState extends ConsumerState<UserListPage> {
  final _listKey = GlobalKey<ScaffoldState>();

  UserBloc _userBloc = UserBloc();
  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    _userBloc = ref.watch(userBloc);

    AsyncValue<List<User>> userP = ref.watch(userProv);

    return Scaffold(
        key: _listKey,
        //  appBar: AppBar(title: Text('User List ( $totalUser )')),
        body: userP.when(
            loading: () => const CircularProgressIndicator(),
            error: (err, stack) => Text('Error: $err'),
            data: (users) {
              return _buildSlidelist(context, users);
            }),
        floatingActionButton: FloatingActionButton(
          onPressed: _userBloc.add,
          tooltip: 'Add',
          child: const Icon(Icons.add),
        ));
  }

  _buildSlidelist(BuildContext context, List<User> users) {
    return  Row(children: [
      Expanded(child: ListView.separated(
          shrinkWrap: true,
          itemCount: users.length,
          separatorBuilder: (context, index) {
            return const Divider();
          },
          itemBuilder: (context, index) {
            return ListTile(
                leading: const Icon(Icons.person),
                title: Text(
                  users[index].firstName!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                subtitle: Text(
                  '${users[index].email} ',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                onTap: () => _userBloc.itemTap(index));
          }))
    ]);
  }
}
