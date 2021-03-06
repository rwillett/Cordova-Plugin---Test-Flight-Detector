/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

channel.createSticky('onCordovaXCDetectReady');
// Tell cordova channel to wait on the CordovaXCDetectReady event
channel.waitForInitialization('onCordovaXCDetectReady');

/**
 * This calls across the bridge to tell if the app is running on Xcode or not then caches the result
 * It is tied to the deviceReady event (deviceReady will wait on this) so this will be available immediatly.
 * @constructor
 */
function XCDetect() {
    this.available = false;
    this.isRunningXcode = false;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.detect(function(info) {
            //ignoring info.cordova returning from native, we should use value from cordova.version defined in cordova.js

            me.available = true;
            me.isRunningXcode = info;

            channel.onCordovaXCDetectReady.fire();
        },function(e) {
            me.available = false;
            channel.onCordovaXCDetectReady.fire();
            // utils.alert("[ERROR] Error initialising DEBUG detector PLUGIN: " + e);
        });
    });
}

/**
 * XCDetect detect
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
 XCDetect.prototype.detect = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "XCDetect", "detect", []);
};

module.exports = new XCDetect();
