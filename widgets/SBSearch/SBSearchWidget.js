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
    'dojo/Evented',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    "dijit/_TemplatedMixin",
    'dojo/_base/html',
    'dojo/on',
    "dojo/Deferred",
    "dojo/text!./Widget.html",
    "dojo/dom-class",
    "dojo/dom-style",
    'esri/tasks/query',
    'esri/symbols/SimpleFillSymbol',
    'esri/tasks/QueryTask',
    'dojo/_base/Color',
    "dojo/_base/window",
    'dojo/_base/lang',
    'dijit/form/Button',
    'dojo/parser'
  ],
  function (
    Evented,
    array,
    declare, _WidgetBase,_TemplatedMixin,
    html, on, Deferred, dijitTemplate,domClass,domStyle,Query, SimpleFillSymbol, QueryTask, Color, win,lang) {
    var Widget= declare("esri.dijit.SBSearch", [_WidgetBase, _TemplatedMixin, Evented],{

      results: [],
      searchLayer: null,

      name: 'SBSearch',
      // template HTML
      templateString: dijitTemplate,

      options:{
        map:null
      },

      constructor: function(options, srcRefNode){
        //this.domNode = srcRefNode;
        var c = options.config;
        this.options = options;
        //"placeholder":"Type here to enter search keywords...",
        //"featurelayer":"",
        //"searchdefault":"Owner1 like '%Smith%'"
        //labelfield

      },

      startup: function() {
        this.inherited(arguments);
        console.log('SBSearchWidget startup');
        //html.place(this.templateString, this.domNode());

        if (this.options.config.searchdefault) {
          dojo.byId("SBSearchPanelTextBox").value = this.options.config.searchdefault;
        }



      },
      
      _doSBSearch:function()
      {
        sSearchText = dojo.byId("SBSearchPanelTextBox").value;

        var queryTask;
        var query = new Query();

        if (this.options.config.featurelayer == null || this.options.config.featurelayer == '') {
          var fl = this.map.getLayer(this.map.graphicsLayerIds[0]);
          this.searchLayer = fl;
          queryTask = new QueryTask(fl.url);
        }
        else {

          queryTask = new QueryTask(this.options.config.featurelayer);
        }

        query.where = sSearchText;// "Owner1 like '%" + sSearchText + "%'";
        query.outFields = ["*"];
        query.returnGeometry = true;
        query.outSpatialReference = this.map.spatialReference;

        queryTask.execute(query, lang.hitch(this, function (result) {
          //remove all graphics on the maps graphics layer
          this.map.graphics.clear();


          var resultFeatures = result.features;
          //Loop through each feature returned
          var sfs = new SimpleFillSymbol().setColor(new Color([255, 0, 0, 1]));;
          this.results.length = 0;

          var graphic;
          for (var i = 0, il = resultFeatures.length; i < il; i++) {
            //Get the current feature from the featureSet.
            //Feature is a graphic
            graphic = resultFeatures[i];
            graphic.setSymbol(sfs);


            //Set the infoTemplate.
            //graphic.setInfoTemplate(infoTemplate);

            //Add graphic to the map graphics layer.
            this.map.graphics.add(graphic);
            this.results.push(graphic);

          }

          var env = graphic.geometry.getExtent();
          if (env != null) {
            this.map.setExtent(graphic.geometry.getExtent());
          }
          else {
            this.map.centerAndZoom(graphic.geometry, 12);
          }

          this.displayResults();
        }));
       
      },


      _createSearchResultNode: function(f){

        var node = html.create('div', {
          'class': 'SBSearchResult'
        }, this.SBSearchResultsListNode);

        var v = this._getContent(f);
        var o = f.attributes.OBJECTID;

        html.create('div', {
          'class': 'SBSearchResult',
          innerHTML: v,
          
          title: v
        }, node);

        dojo.attr(node, "OBJECTID", o);

        this.own(on(node, 'click', lang.hitch(this, function(e){
          var oo = e.currentTarget.attributes.OBJECTID.value;
          //alert(oo);

          this._zoomSelect(oo);
        })));



      },
      _zoomSelect:function(objectid){
        //this.searchLayer.
        for (i = 0; i < this.results.length; i++) {
          var graphic = this.results[i];
          if (graphic.attributes.OBJECTID == objectid) {

            this.map.graphics.clear();

            var sfs = new SimpleFillSymbol().setColor(new Color([255, 0, 0, 1]));;

            graphic.setSymbol(sfs);


            //Set the infoTemplate.
            //graphic.setInfoTemplate(infoTemplate);

            //Add graphic to the map graphics layer.
            this.map.graphics.add(graphic);

            var env = graphic.geometry.getExtent();
            if (env != null) {
              this.map.setExtent(graphic.geometry.getExtent());
            }
            else {
              this.map.centerAndZoom(graphic.geometry, 12);
            }

            return;//
          }

        }
      },
      _getContent:function(f){
        //var a = this.searchLayer.infoTemplate;
        //b = a && a.content;
        //sbtest f.infoTemplate = this.searchLayer.infoTemplate;
        //f._graphicsLayer = this.searchLayer;
        //if (lang.isFunction(b))
        //  b = b.call(a, f);
        //else if (lang.isString(b))
        //  b = k.substitute(f.attributes, b);

        //return f.getContent().innerHTML;

        if (f.getTitle() != null) {
          return f.getTitle();
        }
        else {
          if (this.config.labelfield != null && this.config.labelfield != "") {
            return f.attributes[this.config.labelfield];

          }
          else {

            return f.attributes.OBJECTID;

          }
        }

      },
      displayResults: function () {
        // summary:
        //    remove all and then add
        html.empty(this.SBSearchResultsListNode);
     
        array.forEach(this.results, function (feature) {
          this._createSearchResultNode(feature);
        }, this);
      },

      _onKeyUp:function(k)
      {
        var sSearchText = null;

        //enter
        if (k.keyCode == 13) {
          this._doSBSearch();

        }
        else if (dojo.byId("SBSearchPanelTextBox").value == '' || dojo.byId("SBSearchPanelTextBox").value == null) {
          html.empty(this.SBSearchResultsListNode);
          this.map.graphics.clear();
          this.results.length = 0;
        }


      }
      
    });
    return Widget;

  });