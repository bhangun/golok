import 'package:flutter/material.dart';

import '../blogic/status_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/status.dart';

class StatusForm extends StatefulWidget {
  final Status? data;
  StatusForm({this.data});
  @override
  _StatusFormState createState() => _StatusFormState();
}

class _StatusFormState extends State<StatusForm> {

  late StatusStore _statusStore = StatusStore();

  @override
  void dispose() {
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

   
    
    _.addListener(() {
      _statusStore.set(_.text);
    }); 
    _.addListener(() {
      _statusStore.set(_.text);
    }); 
    _.addListener(() {
      _statusStore.set(_.text);
    }); 
    _.addListener(() {
      _statusStore.set(_.text);
    }); 
    _.addListener(() {
      _statusStore.set(_.text);
    }); 
    _.addListener(() {
      _statusStore.set(_.text);
    }); 
    _.addListener(() {
      _statusStore.set(_.text);
    }); 

    return  Scaffold(
            appBar: AppBar(
              title: Text(_statusStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _statusStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _statusStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _statusStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_statusStore.isModified ? KutAlert() : Container(),
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
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
    ];
  }
}
