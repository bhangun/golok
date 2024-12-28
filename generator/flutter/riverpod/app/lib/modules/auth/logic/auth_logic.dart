import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/models/general_status.dart';
import '../model/auth_model.dart';


final authProvider =
    StateNotifierProvider<AuthenticationNotifier, AuthenticationState>((ref) {
  return AuthenticationNotifier();
});

// Notifier to manage the login state
class AuthenticationNotifier extends StateNotifier<AuthenticationState> {
  AuthenticationNotifier() : super(const AuthenticationState());


  // Trigger the login process
  Future<void> login(BuildContext context, String username, String password) async {
    // Simulate loading state
    state = state.copyWith(status: const StateStatus(loading: true));


    // Check if the login is successful
    if (state.username == 'test@example.com' && state.password == 'password') {
      state = state.copyWith(loggedIn: true, status: const StateStatus(loading: false));
      context.go('/');
    } else {
      // Handle login failure
      state = state.copyWith(status:
          const StateStatus(loading: false, error: true, errorMessage: 'Invalid credentials'));
    }
  }

  // Trigger the login process
  Future<void> logout(BuildContext context) async {
    // Invoke sign out API
    //if(logout to API){
    state = state.copyWith(loggedIn: false, status: const StateStatus(loading: false));
    context.go('/login');
    /* } else {
      // Handle login failure
      state = state.copyWith(loading: false, error: 'Invalid credentials');
    } */
  }
}
