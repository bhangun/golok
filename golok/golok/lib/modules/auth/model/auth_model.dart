import 'package:flutter/foundation.dart';

import '../../../app/models/general_status.dart';
import '../../account/models/user.dart';

@immutable
class AuthenticationState {
  const AuthenticationState(
      {this.username,
      this.password,
      this.rememberMe = false,
      this.user,
      this.hasErrorInForgotPassword = false,
      this.hasErrorsInLogin = false,
      this.token ,
      this.loggedIn = false,
      this.loginMessage,
      this.passwordMessage,
      this.confirmPassword ,
      this.confirmPasswordMessage,
      this.status = const StateStatus()});

  final String? username;
  final String? password;
  final bool rememberMe;
  final String? token;
  final User? user;
  final bool loggedIn;
  final String? loginMessage;
  final String? passwordMessage;
  final String? confirmPassword;
  final String? confirmPasswordMessage;
  final bool hasErrorInForgotPassword;
  final bool hasErrorsInLogin;
  final StateStatus status;

  AuthenticationState copyWith(
      {String? username,
      String? password,
      bool? rememberMe,
      String? token,
      User? user,
      bool? loggedIn,
      String? loginMessage,
      String? passwordMessage,
      String? confirmPassword,
      String? confirmPasswordMessage,
      StateStatus? status}) {
    return AuthenticationState(
        username: username ?? this.username,
        password: password ?? this.password,
        rememberMe: rememberMe ?? this.rememberMe,
        token: token ?? this.token,
        user: user ?? this.user,
        loggedIn: loggedIn ?? this.loggedIn,
        loginMessage: loginMessage ?? this.loginMessage,
        passwordMessage: passwordMessage ?? this.passwordMessage,
        confirmPassword: confirmPassword ?? this.confirmPassword,
        confirmPasswordMessage:
            confirmPasswordMessage ?? this.confirmPasswordMessage,
        status: status ?? this.status);
  }

  @override
  String toString() {
    return 'username: $username';
  }
}
