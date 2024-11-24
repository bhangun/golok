import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NotFoundScreen extends StatelessWidget {
  final GoRouterState state;
  const NotFoundScreen({super.key, required this.state});

  @override
  Widget build(BuildContext context) {
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
