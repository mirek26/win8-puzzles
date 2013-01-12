(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/home/home.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ready: function (element, options) {
            var seeAllButton = element.querySelector(".seeall");
            seeAllButton.onclick = function () { nav.navigate("pages/items/items.html", {}); };

            function loadpuzzle(str, puzzle) {
                var title = element.querySelector(".recommended ." + str + " .overlay h4");
                title.textContent = puzzle.title;
                var prediction = element.querySelector(".recommended ." + str + " .overlay h6");
                prediction.textContent = "Prediction: " + puzzle.prediction;
                var whole = element.querySelector(".recommended ." + str);
                whole.onclick = function () {
                    nav.navigate("pages/puzzle/puzzle.html", { puzzle: puzzle });
                };
            }

            var recommendations = Data.getRecommendations();
            loadpuzzle("easy", recommendations.easy);
            loadpuzzle("medium", recommendations.medium);
            loadpuzzle("hard", recommendations.hard);
            
            //nav.navigate("pages/puzzle/puzzle.html", { puzzle: recommendations.easy });
        },

        unload: function () {
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
        },

    });
})();
