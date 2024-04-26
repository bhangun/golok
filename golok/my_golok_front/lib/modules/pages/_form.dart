import 'package:flutter/material.dart';

import '../blogic/_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/.dart';

class Form extends StatefulWidget {
  final ? data;
  Form({this.data});
  @override
  _FormState createState() => _FormState();
}

class _FormState extends State<Form> {

  late Store _Store = Store();

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

   
    

    return  Scaffold(
            appBar: AppBar(
              title: Text(_Store.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _Store.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _Store.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _Store.success
            ? Container()
            : showErrorMessage(context, '') 
        //_Store.isModified ? KutAlert() : Container(),
      ],
    );
  }

  _buildForm() {
    return SafeArea(
        child: ListView(
            padding: EdgeInsets.symmetric(horizontal: 24.0),
            children: _buildListChild()));
  }

  _buildListChild() {
    return <Widget>[
      SizedBox(height: 120.0),
    ];
  }
}
