(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/puzzleType/puzzleType.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ready: function (element, type) {
            element.querySelector(".titlearea").textContent = type.title;
            element.querySelector(".rules").textContent = type.rules;

            var seeAllButton = element.querySelector(".seeall");
            seeAllButton.onclick = function () { nav.navigate("pages/puzzleList/puzzleList.html", {type: type.id}); };

            function loadpuzzle(str, puzzle) {
                var title = element.querySelector(".recommended ." + str + " .overlay h4");
                title.textContent = puzzle.name;
                var prediction = element.querySelector(".recommended ." + str + " .overlay h6");
                prediction.textContent = "Prediction: " + puzzle.expectedTime;
                var whole = element.querySelector(".recommended ." + str);
                whole.onclick = function () {
                    nav.navigate("pages/puzzleInstance/puzzleInstance.html", { puzzle: puzzle });
                };
            }

            var promise = DAL.whenRecommendationsLoaded();
            promise.then(function (recommendations) {
                loadpuzzle("easy", recommendations[0]);
                loadpuzzle("medium", recommendations[1]);
                loadpuzzle("hard", recommendations[2]);
            }, function(error) {
                return "";
            });
        },

        unload: function () {
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
        },

    });
})();
