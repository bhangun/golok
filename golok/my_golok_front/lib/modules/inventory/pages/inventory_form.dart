import 'package:flutter/material.dart';

import '../blogic/inventory_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/inventory.dart';

class InventoryForm extends StatefulWidget {
  final Inventory? data;
  InventoryForm({this.data});
  @override
  _InventoryFormState createState() => _InventoryFormState();
}

class _InventoryFormState extends State<InventoryForm> {

  late InventoryStore _inventoryStore = InventoryStore();

  @override
  void dispose() {
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
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
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 
    _.addListener(() {
      _inventoryStore.set(_.text);
    }); 

    return  Scaffold(
            appBar: AppBar(
              title: Text(_inventoryStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _inventoryStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _inventoryStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _inventoryStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_inventoryStore.isModified ? KutAlert() : Container(),
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
