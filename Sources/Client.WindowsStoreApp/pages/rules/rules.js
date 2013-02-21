(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    var controller;
    var flyout;
    
    function init(type){
        $(".titlearea").text(type.title);
        $(".rules").html(type.rules);

        controller = new PuzzleController({ id: type.training, type: type.id }, document.getElementById("practice"));
        controller.onSolved = solved;
    }

    function solved() {
        document.getElementById("solvedFlyout").winControl.show($(".trainingsection .title")[0], "bottom", "center");
    }

    ui.Pages.define("/pages/rules/rules.html", {
        ready: function (element, type) {
            var typeid;
            if (typeof (type) == typeof ("")) {
                typeid = type;
                DAL.whenPuzzleTypesLoaded().then(function (types) {
                    var type = types.filter(function (t) { return t.id == typeid })[0];
                    init(type);
                });
            } else {
                typeid = type.id;
                init(type);
            }

            var play = element.querySelector(".playButton");
            DAL.whenPuzzleListLoaded(typeid).then(function(list){
                var unsolved = list.filter(function (p) { return p.solved == false });
                var p = unsolved.length == 0 ? list.random() : unsolved[0];
                play.onclick = function () {
                    nav.navigate("pages/puzzle/puzzle.html", {puzzleMeta: p})
                };
            });
            var seeAll = element.querySelector(".seeallButton");
            seeAll.onclick = function () { nav.navigate("pages/list/list.html", { type: typeid }); };

            var flyout = document.getElementById("solvedFlyout").winControl;
            flyout.addEventListener("beforehide", controller.reset);
            document.getElementById("resetButton").addEventListener("click", function () {
                flyout.hide();
            });

            document.getElementById("backbutton").addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/home/home.html");
            });
        },

        unload: function () {
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
        },
    });
})();
