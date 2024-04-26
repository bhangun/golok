import 'package:flutter/foundation.dart';

import '../../../models/status.dart';

@immutable
class Authentication {
  const Authentication(
      {required this.username,
      required this.password,
      this.rememberMe = false,
      this.token = '',
      this.loggedIn = false,
      this.loginMessage = '',
      this.passwordMessage = '',
      this.confirmPassword = '',
      this.confirmPasswordMessage = '',
      this.status = const Status(
          success: false,
          showError: false,
          loading: false,
          errorMessage: '',
          hasErrorInForgotPassword: false,
          hasErrorsInLogin: false)});

  final String username;
  final String password;
  final bool rememberMe;
  final String token;
  // final User user;
  final bool loggedIn;
  final String loginMessage;
  final String passwordMessage;
  final String confirmPassword;
  final String confirmPasswordMessage;
  final Status status;

  Authentication copyWith(
      {String? username,
      String? password,
      bool? rememberMe,
      String? token,
      //  User? user,
      bool? loggedIn,
      String? loginMessage,
      String? passwordMessage,
      String? confirmPassword,
      String? confirmPasswordMessage,
      Status? status}) {
    return Authentication(
        username: username ?? this.username,
        password: password ?? this.password,
        rememberMe: rememberMe ?? this.rememberMe,
        token: token ?? this.token,
        //  user: user ?? this.user,
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
    return username;
  }
}
