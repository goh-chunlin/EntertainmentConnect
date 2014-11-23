/// <reference path="/LiveSDKHTML/js/wl.js" />
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    // Create a namespace to make the data publicly
    // accessible. 
    var dataArray = [];

    var dataList = new WinJS.Binding.List(dataArray);

    var publicMembers =
        {
            itemList: dataList
        };
    WinJS.Namespace.define("SkyDriveVideos", publicMembers);

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        // Create the binding object that connects the appInfo data to the app's UI.
        binding.Person = WinJS.Binding.as(appInfo);

        // Initialize the Live SDK.
        WL.init();

        // Update the binding object so that it reflects the state of the app and updates the UI to reflect that state.
        getInfoFromAccount(binding.Person);

        if (args.detail.kind === activation.ActivationKind.launch) {
            // Init the local storage
            var applicationData = Windows.Storage.ApplicationData.current;
            var localSettings = applicationData.localSettings;

            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                if (!localSettings.values["SkyDriveLastUpdatedTime"]) {
                    localSettings.values["SkyDriveLastUpdatedTime"] = "";
                }

                // Define the Settings flyout commands.
                app.onsettings = function (e) {
                    e.detail.applicationcommands = {
                        "account": {
                            href: "/account/account.html",
                            title: "Account"
                        },
                        "privacy": {
                            href: "/privacy/privacy.html",
                            title: "Privacy"
                        }
                    }

                    // Command to update app's settings menu using the preceding definition.
                    WinJS.UI.SettingsFlyout.populateSettings(e);
                }
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.

                if (!localSettings.values["SkyDriveLastUpdatedTime"]) {
                    localSettings.values["SkyDriveLastUpdatedTime"] = "";
                }
            }

            // Check for the updates in One Drive account every 60 seconds to retrieve newly added music/videos
            setInterval(function () { getSkyDriveUpdatedTime(); }, 60000);

            args.setPromise(WinJS.UI.processAll());

            var listView = document.querySelector("#videoListView").winControl;
            listView.onselectionchanged = playVideoFromAvailableMediaList;
        }
    };

    app.onloaded = function (args) {
        // Initialize the UI to match the corresponding data object.
        var div = document.getElementById("bindingDiv");
        WinJS.Binding.processAll(div, appInfo);
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();