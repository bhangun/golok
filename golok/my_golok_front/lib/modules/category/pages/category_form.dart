import 'package:flutter/material.dart';

import '../blogic/category_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/category.dart';

class CategoryForm extends StatefulWidget {
  final Category? data;
  CategoryForm({this.data});
  @override
  _CategoryFormState createState() => _CategoryFormState();
}

class _CategoryFormState extends State<CategoryForm> {

  late CategoryStore _categoryStore = CategoryStore();

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

   
    

    return  Scaffold(
            appBar: AppBar(
              title: Text(_categoryStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _categoryStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _categoryStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _categoryStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_categoryStore.isModified ? KutAlert() : Container(),
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
