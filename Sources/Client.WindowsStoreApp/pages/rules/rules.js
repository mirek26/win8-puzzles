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
            element.querySelector(".titlearea").textContent = type.title;
            element.querySelector(".rules").innerHTML = type.rules;

            var seeAllButton = element.querySelector(".seeall");
            seeAllButton.onclick = function () { nav.navigate("pages/list/list.html", { type: type.id }); };

            //var puzzlebox = document.getElementById("practice");
            //this.controller = new PuzzleController(type.training, puzzlebox);
            //this.controller.onSolved = this.solved;
        },

        unload: function () {
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
        },

    });
})();
