import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NotFoundScreen extends StatelessWidget {
  final GoRouterState state;
  const NotFoundScreen({Key? key, required this.state}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('${state.name} --- ${state.path}');
    return Scaffold(
      appBar: AppBar(
        title: const Text('404') ,
      ),
      body: Center(
        child: Column(children: [
          const Text('Mohon maaf halaman tidak di temukan'),
          TextButton(
              onPressed: () => context.go('/'),
              child: const Text('Kembali ke halaman utama'))
        ]),
      ),
    );
  }
}
