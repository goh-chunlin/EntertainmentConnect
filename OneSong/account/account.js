// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/account/account.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            // Update the Account Flyout to reflect 
            //  the user's current sign-in state.
            updateDisplay(binding.Person);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            // TODO: Respond to changes in viewState.
        }
    });
})();

function updateDisplay(p) {
    // Update the display to show the caption text and button
    // that apply to the current sign-in state.

    // Test for a parameter and assign the unbound global data object
    //  if a parameter wasn't passed. This doesn't refresh the screen
    //  but it does keep the data object coherent.
    if (undefined === p) { p = appInfo; }

    // Get the elements in the display for this function to update.
    var prompt = document.getElementById("accountPrompt");
    var inBtn = document.getElementById("signInBtn");
    var outBtn = document.getElementById("signOutBtn");

    // Update the elements to show the correct text and button for the
    //  the sign-in state.
    if (0 == p.index) {
        // The user is signed out, so prompt them to sign in.
        prompt.innerText = "Sign in to start your journey in Entertainment Connect."
        outBtn.style.display = "none";
        inBtn.style.display = "block";
    } else {
        // The user is signed in, so welcome them.
        //  If the user can sign out, show them the sign-out button.

        var promptText = "Welcome, " + p.person.userName + "!";
        var signOutBtnStyle = "block";
        if (showSignOutButton()) {
            // The user is signed in and can sign out later,
            //  so welcome them and show the sign-out button.
            signOutBtnStyle = "block";
        } else {
            // The user is signed in and can't sign out later,
            //  so welcome them and hide the sign-out button.
            promptText = promptText + " The app is signed in through your Windows 8 account."
            signOutBtnStyle = "none";
        }

        prompt.innerText = promptText;
        outBtn.style.display = signOutBtnStyle;
        inBtn.style.display = "none";
    }
}

function signInCmd(p) {
    // Sign the new user in.
    //  This call closes the Flyout and Settings charm.
    signInNewUser(p);
}

function signOutCmd(p) {
    // Sign the current user out.
    signOutUser(p);

    // Return to the Settings flyout.   
    WinJS.UI.SettingsFlyout.show();
}