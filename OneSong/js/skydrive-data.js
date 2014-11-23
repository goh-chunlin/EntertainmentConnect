function getSkyDriveUpdatedTime() {
    var p = binding.Person;
    if (undefined === p) {
        p = appInfo;
    }

    if (0 != p.index) {
        // Only ping SkyDrive when the user is signed in

        // Show loading progress bar (02-Connect to SkyDrive)
        showOrHideMainProgressBar(true);

        WL.login({
            scope: ["wl.skydrive", "wl.contacts_skydrive"]
        }).then(
            function (response) {
                WL.api({
                    path: "me/skydrive",
                    method: "GET"
                }).then(
                    onGetSkyDriveComplete,
                    function (responseFailed) {
                        // Hide loading progress bar (02-Connect to SkyDrive)
                        showOrHideMainProgressBar(false);

                        showMessage("Error calling OneDrive API", responseFailed.error.message);
                    }
                );
            },
            function (responseFailed) {
                // Hide loading progress bar (02-Connect to SkyDrive)
                showOrHideMainProgressBar(false);

                showMessage("Error signing in", responseFailed.error.message);
            }
        );
    }
}

function onGetSkyDriveComplete(response) {
    // Hide loading progress bar (02-Connect to SkyDrive)
    showOrHideMainProgressBar(false);

    var skyDriveUpdatedTime = response.updated_time;

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    if (skyDriveUpdatedTime === localSettings.values["SkyDriveLastUpdatedTime"]) {
        var currentItemListLength = SkyDriveVideos.itemList.length;
        if (currentItemListLength == 0) {
            readSkyDriveFiles();
        }
    } else {
        localSettings.values["SkyDriveLastUpdatedTime"] = skyDriveUpdatedTime;
        readSkyDriveFiles();
    }
}

function readSkyDriveFiles() {
    // Show loading progress bar (03-Reading from SkyDrive)
    showOrHideMainProgressBar(true);

    WL.login({
        scope: ["wl.skydrive", "wl.contacts_skydrive"]
    }).then(
        function (response) {
            WL.api({
                path: "me/skydrive/files",
                method: "GET"
            }).then(
                onGetFilesComplete,
                function (responseFailed) {
                    // Hide loading progress bar (03-Reading from SkyDrive)
                    showOrHideMainProgressBar(false);

                    showMessage("Error calling OneDrive API", responseFailed.error.message);
                }
            );
        },
        function (responseFailed) {
            // Hide loading progress bar (03-Reading from SkyDrive)
            showOrHideMainProgressBar(false);

            showMessage("Error reading files from OneDrive", responseFailed.error.message);
        }
    );
}

function onGetFilesComplete(response) {
    var items = response.data;
    var foundFolder = 0;

    var currentItemListLength = SkyDriveVideos.itemList.length;
    for (var i = 0; i < currentItemListLength; i++) {
        SkyDriveVideos.itemList.pop();
    }

    for (var i = 0; i < items.length; i++) {
        if (items[i].type == 'folder' || items[i].type == 'album') {
            getHTML5MediaFilesFromFolder(items[i].id);
        }
    }
}

function getHTML5MediaFilesFromFolder(folderID) {
    WL.api({
        path: folderID + "/files",
        method: "GET"
    }).then(
        function (response) {

            var videoList = [];

            // Reload video data
            for (var i = 0; i < response.data.length; i++) {
                if (stringEndWith(response.data[i].name, ".mp4") ||
                    stringEndWith(response.data[i].name, ".mp3")) {

                    if (response.data[i].duration != null) {
                        var second = Math.floor(parseInt(response.data[i].duration) / 1000);
                        var minute = Math.floor(second / 60);
                        second = second - minute * 60;

                        response.data[i].duration = generateLeadingZero(minute, 2) + ":" + generateLeadingZero(second, 2);
                    } else {
                        response.data[i].duration = "";
                    }

                    SkyDriveVideos.itemList.push(response.data[i]);
                }
            }

            // Hide loading progress bar (03-Reading from SkyDrive)
            showOrHideMainProgressBar(false);

        },
        function (responseFailed) {
            // Hide loading progress bar (03-Reading from SkyDrive)
            showOrHideMainProgressBar(false);

            showMessage("Error calling OneDrive API", responseFailed.error.message + " The Folder ID is " + folderID);
        }
    );
}

function getMediaSourceUrlByVideoStaticUrl(parentFolderID, videoStaticUrl) {
    // Show loading progress bar (04-Getting real file URL from SkyDrive)
    showOrHideMainProgressBar(true);
    WL.api({
        path: parentFolderID + "/files",
        method: "GET"
    }).then(
        function (response) {
            // Reload video data
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].link == videoStaticUrl) {
                    playNewMedia(videoStaticUrl, response.data[i].source, response.data[i].name);
                }
            }

            // Hide loading progress bar (04-Getting real file URL from SkyDrive)
            showOrHideMainProgressBar(false);

        },
        function (responseFailed) {
            // Hide loading progress bar (04-Getting real file URL from SkyDrive)
            showOrHideMainProgressBar(false);

            showMessage("Error calling OneDrive API to read video URL", responseFailed.error.message + " The Folder ID is " + parentFolderID);
        }
    );
}