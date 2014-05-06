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
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'dijit/form/ValidationTextBox'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    Table) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-SBSearch-setting',

      startup: function() {
        this.inherited(arguments);
        if (!this.config.SBSearch) {
          this.config.SBSearch = {};
        }

        this.setConfig(this.config);
      },

      setConfig: function (config) {
        console.log('SB Search Widget setConfig');
        this.config = config;
        if (config.SBSearch.placeholder) {
          this.searchHint.set('value', config.SBSearch.placeholder);
        }
  
        if (config.SBSearch.searchdefault) {
          this.searchDefault.set('value', config.SBSearch.searchdefault);
        }


        if (config.SBSearch.featurelayer) {
          this.featureLayer.set('value', config.SBSearch.featurelayer);
        }

        if (config.SBSearch.labelfield) {
          this.labelField.set('value', config.SBSearch.labelfield);
        }

      },

      
      getConfig: function() {
        console.log('SB Search Widget setConfig');
        this.config.SBSearch.placeholder = this.searchHint.value;
        this.config.SBSearch.featurelayer = this.featureLayer.value;
        this.config.SBSearch.searchdefault = this.searchDefault.value;
        this.config.SBSearch.labelfield = this.labelField.value;

        return this.config;
      }

    });
  });