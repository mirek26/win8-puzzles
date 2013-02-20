(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/rules/rules.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ready: function (element, type) {
            this.solved();
            element.querySelector(".titlearea").textContent = type.title;
            element.querySelector(".rules").innerHTML = type.rules;

            var play = element.querySelector(".playButton");
            var seeAll = element.querySelector(".seeallButton");
            seeAll.onclick = function () { nav.navigate("pages/list/list.html", { type: type.id }); };

            var puzzlebox = document.getElementById("practice");
            var section = element.querySelector(".trainingsection");
            var h2 = section.querySelector("h2");
            puzzlebox.style.height = section.offsetHeight - h2.offsetHeight - 220 + "px";
            this.controller = new PuzzleController({ id: type.training, type: type.id }, puzzlebox);
            this.controller.onSolved = this.solved;
        },

        unload: function () {
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
        },

        solved: function () {
            //$("#practice").hide();
            $(".finished").show();
        }
    });
})();
