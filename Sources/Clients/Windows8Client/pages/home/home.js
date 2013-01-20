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

        menu: [
            { title: "About puzzle solving", subtitle: "Train your brain every day!", action: "puzzlesolving" },
            { title: "Your statistics", subtitle: "How you are doing compared to others.", action: "statistics" },
            { title: "About the puzzles", subtitle: "Credits for the puzzles goes to...", action: "aboutpuzzles" },
            { title: "Settings", subtitle: "Change the look and feel here.", action: "settings" }
        ],

        menuAction: function() {
        },

        puzzleSelected: function (args) {
            var type = this.puzzleTypes[args.detail.itemIndex].id;
            nav.navigate("/pages/puzzleType/puzzleType.html", type );
        },

        ready: function (element, options) {
            // menu ListView
            var menu = element.querySelector(".menu").winControl;
            menu.itemDataSource = (new WinJS.Binding.List(this.menu)).dataSource;
            menu.itemTemplate = element.querySelector(".menuitemtemplate");
            menu.oniteminvoked = this.menuAction.bind(this);
            menu.layout = new ui.ListLayout();
            
            // list of puzzles
            var grid = element.querySelector(".grid").winControl;

            DAL.whenPuzzleTypesLoaded().done(function (types) {
                this.puzzleTypes = types;
                grid.itemDataSource = (new WinJS.Binding.List(types)).dataSource;
                grid.itemTemplate = element.querySelector(".puzzletypetemplate");
                grid.oniteminvoked = this.puzzleSelected.bind(this);
            }.bind(this));

            this.initializeLayout(grid, Windows.UI.ViewManagement.ApplicationView.value);
            grid.element.focus();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

        },

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />
            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },
       
    });
})();
