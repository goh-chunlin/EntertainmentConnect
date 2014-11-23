(function () {

    "use strict";

    // The global data object used to reference the binding object
    WinJS.Namespace.define("binding",
        {
            Person: null
        }
    );

    // Static text
    WinJS.Namespace.define("display",
        {
            state: ["Welcome to Entertainment Connect", "'s favorite media"]
        }
    );

    // The app's data object that is used to map the
    //  sign-in state to the UI.
    WinJS.Namespace.define("appInfo",
        {
            index: 0,       // The sign-in state.
            image: {
                // The image to show
                url: "/images/SignedOutImage.png",
                caption: "Sign in at the Account section to start your journey."
            },
            person: {
                // The info about the user
                userName: null,
                titleText: display.state[0]
            }
        }
   );

})();