(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var app = WinJS.Application;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        puzzleSelected: function (args) {
            var type = this.puzzleTypes[args.detail.itemIndex];
            nav.navigate("/pages/rules/rules.html", type );
        },

        ready: function (element, options) {
            document.getElementById("refreshButton").addEventListener("click", this.refresh.bind(this));
            
            //element.querySelector(".statistics").addEventListener("click", function () {
            //});
            element.querySelector(".settings").addEventListener("click", function () {
                WinJS.UI.SettingsFlyout.show();
            });
            element.querySelector(".rateandreview").addEventListener("click", function () {
                Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri("ms-windows-store:REVIEW?PFN=35158myreg.Alllogicpuzzles_5vpjqby3hhdkr"));
            });

            // list of puzzles
            var grid = element.querySelector(".grid").winControl;

            var promise = DAL.whenPuzzleTypesLoaded();
            DAL.whenPuzzleTypesLoaded().then(function (types) {
                this.puzzleTypes = types;
                grid.itemDataSource = (new WinJS.Binding.List(types)).dataSource;
                grid.itemTemplate = element.querySelector(".puzzletypetemplate");
                grid.oniteminvoked = this.puzzleSelected.bind(this);
            }.bind(this));

            this.initializeLayout(grid, Windows.UI.ViewManagement.ApplicationView.value);
            grid.element.focus();

            this.refreshUser();
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
        
        refresh: function () {
            var grid = document.querySelector(".grid").winControl;
            DAL.whenPuzzleTypesLoaded(true).then(function(types) {
                this.puzzleTypes = types;
                grid.itemDataSource = (new WinJS.Binding.List(types)).dataSource;
            }.bind(this));
        },
        
        refreshUser: function () {
            if (!app.user || app.user == {}) {
                app.getUserData(this.loadUserInfo, function() {
                    //var el = document.getElementById("user");
                    //el.innerText = "Sign in here.";
                    //el.addEventListener("click", app.login.bind(this, function() {
                    //    this.refreshUser();
                    //}, function() {
                    //    el.innerText = "Sign in failed.";
                    //}));
                });
            } else {
                this.loadUserInfo();
            }
        },
        
        loadUserInfo: function() {
            //document.getElementById("user").innerText = app.user.name;
            //this.removeEventListener("click");
        }
    });
})();
