///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/_base/html',
    'dojo/on',
    'esri/tasks/query',
    'esri/symbols/SimpleFillSymbol',
    'esri/tasks/QueryTask',
    'dojo/_base/Color',
    './SBSearchWidget',
    'dojo/_base/lang',
    'dijit/form/Button',
    'dojo/parser'
],
  function (
    declare, BaseWidget,
    html, on, Query, SimpleFillSymbol, QueryTask, Color, SBSearchWidget,lang) {
    return declare([BaseWidget], {

      name: 'SBSearch',
      baseClass: 'jimu-widget-SBSearch',

      startup: function () {
        this.inherited(arguments);
        console.log('SB Search Widget startup');

          
        //"placeholder":"Type here to enter search keywords...",
        //"featurelayer":"",
        //"searchdefault":"Owner1 like '%Smith%'"

        var json = {};
        json.map = this.map;
        json.config = this.config.SBSearch;
        var sbs = new SBSearchWidget(json);

        //on(geocoder, 'select', lang.hitch(this, "findComplete"));

        html.place(sbs.domNode, this.domNode);
        sbs.startup();


      }

    });

  });