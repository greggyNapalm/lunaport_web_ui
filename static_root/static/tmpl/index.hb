<!DOCTYPE html>
<html lang="en" ng-app="Lunaport">
<head>
    <meta charset="utf-8">
    <title>Lunaport</title>
    <meta name="description" content="">
    <meta name="author" content="dev">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/{{ artefact_css }}" rel="stylesheet">
</head>

<body>
    <div id="wrap">
      <div ng-include="'/static/tmpl/header.html'"></div>
      <toaster-container toaster-options="{'time-out': 3000}"></toaster-container>
      <div ng-view ng-animate="{enter:'fade-enter'}"></div>
    </div>
    <div ng-include="'/static/tmpl/footer.html'"></div>

    <script src="/static/js/3d_party/misc/ace/ace.js"></script>
    <script src="/static/js/3d_party/misc/ace/ext-language_tools.js"></script>

    <script src="/{{ artefact_js }}"></script>
</body>
</html>
