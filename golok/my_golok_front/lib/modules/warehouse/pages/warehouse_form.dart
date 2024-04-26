import 'package:flutter/material.dart';

import '../blogic/warehouse_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/warehouse.dart';

class WarehouseForm extends StatefulWidget {
  final Warehouse? data;
  WarehouseForm({this.data});
  @override
  _WarehouseFormState createState() => _WarehouseFormState();
}

class _WarehouseFormState extends State<WarehouseForm> {

  late WarehouseStore _warehouseStore = WarehouseStore();

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
      _warehouseStore.set(_.text);
    }); 
    _.addListener(() {
      _warehouseStore.set(_.text);
    }); 
    _.addListener(() {
      _warehouseStore.set(_.text);
    }); 
    _.addListener(() {
      _warehouseStore.set(_.text);
    }); 
    _.addListener(() {
      _warehouseStore.set(_.text);
    }); 
    _.addListener(() {
      _warehouseStore.set(_.text);
    }); 
    _.addListener(() {
      _warehouseStore.set(_.text);
    }); 

    return  Scaffold(
            appBar: AppBar(
              title: Text(_warehouseStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _warehouseStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _warehouseStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _warehouseStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_warehouseStore.isModified ? KutAlert() : Container(),
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
