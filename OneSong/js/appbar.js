(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("default.html", {
        ready: function (element, options) {
            document.getElementById("cmdLoopAll")
                .addEventListener("click", doClickLoopAll, false);
        },
    });

    // Command button functions
    function doClickLoopAll() {
        var p = binding.Person;
        if (undefined === p) {
            p = appInfo;
        }

        if (0 != p.index) {
            // Only allow function when user is signed in
            if (document.getElementById('msgVideoLoop').innerText.length > 0) {
                document.getElementById('msgVideoLoop').innerText = "";
            } else {
                document.getElementById('msgVideoLoop').innerText = "Replay Mode Activated";
            }

            playVideoFromAvailableMediaList(null);
        }
    }
})();