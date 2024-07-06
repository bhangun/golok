import 'package:flutter/foundation.dart';

@immutable
class StateStatus {
  final bool success;
  final bool cancel;
  final bool loading;
  final bool error;
  final bool showError;
  final String? errorMessage;

  const StateStatus({
    this.success = false,
    this.cancel = false,
    this.loading = false,
    this.error = false,
    this.showError = false,
    this.errorMessage,
  });

  StateStatus copyWith({
    bool? success,
    bool? cancel,
    bool? loading,
    bool? error,
    bool? showError,
    String? errorMessage,
  }) {
    return StateStatus(
      success: success ?? this.success,
      cancel: cancel ?? this.cancel,
      loading: loading ?? this.loading,
      error: error ?? this.error,
      showError: showError ?? this.showError,
      errorMessage: errorMessage,
    );
  }
}

@immutable
class FormStatus {
  final bool cleared;
  final bool filled;
  final bool changed;
  final bool enable;
  final bool pending;
  final bool cancel;
  final bool submit;

  const FormStatus({
    this.cleared = false,
    this.filled = false,
    this.changed = false,
    this.enable = false,
    this.pending = false,
    this.cancel = false,
    this.submit = false,
  });

  FormStatus copyWith({
    bool? cleared,
    bool? filled,
    bool? changed,
    bool? enable,
    bool? pending,
    bool? cancel,
    bool? submit,
  }) {
    return FormStatus(
      cleared: cleared ?? this.cleared,
      filled: filled ?? this.filled,
      changed: changed ?? this.changed,
      enable: enable ?? this.enable,
      pending: pending ?? this.pending,
      cancel: cancel ?? this.cancel,
      submit: submit ?? this.submit,
    );
  }
}
