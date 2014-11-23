function getInfoFromAccount(p) {
    // Test for a parameter and assign the unbound data object
    //  if a parameter wasn't passed. This doesn't refresh the binding
    //  object, but it does keep the data object coherent with the
    //  sign-in state.
    if (undefined === p) {
        p = appInfo;

        // Hide loading progress bar (01-Login and Logout)
        showOrHideMainProgressBar(false);
    }

    // Call the user's Microsoft account to get the identity of the current 
    //  user. If the user is signed in, the success branch runs.
    //  If the user is not signed in, the failure branch runs.
    WL.api({
        path: "me",
        method: "GET"
    }).then(
        function (response) {
            // The program executes this branch when the user is 
            // signed in.

            // Save the app's sign-in state.
            p.index = 1;

            // Set the data to the signed-in state,
            //   get the user's first name, and update the app title.
            p.person.userName = response.first_name;
            p.person.titleText = p.person.userName + display.state[p.index];

            // These elements would normally be read from the user's data,
            // but in this example, app resources are used.
            p.image.url = "/images/SignedOutImage.png";
            p.image.caption = "Welcome, " + p.person.userName + "!";

            getProfilePhoto(p);

            //showMessage("Welcome!", "You have successfully signed in to Entertainment Connect!");

            getSkyDriveUpdatedTime();
        },
        function (responseFailed) {
            // The program executes this branch when the user is 
            // not signed in.

            // Reset the app state.
            p.index = 0;

            // Set the data to the signed-out state values
            //   and update the app title.
            p.person.userName = null;
            p.person.titleText = display.state[p.index];

            // These elements are the default values to show
            //  when the user is not signed in.
            p.image.url = "/images/SignedOutImage.png";
            p.image.caption = "Sign in at the Account to start your journey.";

            // Hide loading progress bar (01-Login and Logout)
            showOrHideMainProgressBar(false);
        }
    );

}

function getProfilePhoto(p) {
    WL.api({
        path: "/me/picture",
        method: "GET"
    }).then(
        function (response) {
            p.image.url = response.location;

            // Hide loading progress bar (01-Login and Logout)
            showOrHideMainProgressBar(false);
        },
        function (responseFailed) {
            showMessage("Error getting your profile photo", responseFailed.error.message);

            // Hide loading progress bar (01-Login and Logout)
            showOrHideMainProgressBar(false);
        }
    );
}

function signInNewUser(p) {
    // Show loading progress bar (01-Login and Logout)
    showOrHideMainProgressBar(true);

    // Sign the user in.

    // Test for a parameter and assign the unbound global data object
    //  if a parameter wasn't passed. This doesn't refresh the screen
    //  but it does keep the data object coherent.
    if (undefined === p) { p = appInfo; }

    // Sign the user in with the minimum scope necessary for the app.
    WL.login({
        scope: ["wl.basic", "wl.signin", "wl.skydrive", "wl.contacts_skydrive"]
    }).then(function (response) {
        getInfoFromAccount(p);
    });
}

function signOutUser(p) {
    // Show loading progress bar (01-Login and Logout)
    showOrHideMainProgressBar(true);

    // Sign the user out.

    // Test for a parameter and assign the unbound global data object
    //  if a parameter wasn't passed. This doesn't refresh the screen
    //  but it does keep the data object coherent.
    if (undefined === p) { p = appInfo; }

    // Sign out and then refresh the app's data object.
    WL.logout().then(function (response) {
        // Clear the video player section
        var videoContainer = document.getElementById('playerContainer');
        while (videoContainer.firstChild) {
            videoContainer.removeChild(videoContainer.firstChild);
        }

        // Clear the video list after user signs out
        var currentItemListLength = SkyDriveVideos.itemList.length;
        for (var i = 0; i < currentItemListLength; i++) {
            SkyDriveVideos.itemList.pop();
        }

        // Clear the looping status
        document.getElementById('msgVideoLoop').innerText = "";

        getInfoFromAccount(p);
    });
}

function showSignOutButton() {
    // Return true or false to indicate whether the user 
    // can sign out of the app.
    return (WL.canLogout());
}