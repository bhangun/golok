<%_

  var newEntities = []

  for (i in services) { 
    
  }

_%>
import 'dart:async';
import 'dart:convert';

import 'rest/rest_services.dart'; <% if(entities.length > 1) { for (i in entities) { %>
import 'package:<%= info.name %>/models/<%= entities[i].entityInstance.toLowerCase() %>.dart'; <% }} else {for (i in services) { %>
import 'package:<%= info.name %>/models/<%= services[i].responseType %>.dart'; <% }} %>

/// <%= info.title %>
/// @version <%= info.version %>
class AppsServices { 
<% for (i in services) { %>
  /// <% if(services[i].desc){ %><%= services[i].desc %> <% } %>
  /// <%= services[i].summary %>
  /// Path: <%= services[i].path %> <% if(services[i].externalDoc){%>
  /// External Doc: <%= services[i].externalDoc %><%}%>
  static <% if(services[i].hasResponse ){%>Future<<%= services[i].responseType %>><%}%> <%= services[i].serviceName %>(<%= services[i].parametersString %>) async { 
    <% if(services[i].hasResponse ) {%>var response = <%}%>await RestServices.<%= services[i].method %>('<%= services[i].path %><%- services[i].query %>'<%- services[i].jsonParam %>); 
    <% if(services[i].hasResponse ){ %>return <%= services[i].responseType %>.fromJson(json.decode(response));<%}%>
  }
<% } %>
}
