(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/list/list.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("refreshButton").addEventListener("click", this.refresh.bind(this));
            var listView = element.querySelector(".itemslist").winControl;

            this.type = options.type;
            DAL.whenPuzzleListLoaded(options.type).then(function (list) {
                this.list = list;
                listView.itemDataSource = (new WinJS.Binding.List(list)).dataSource;
                listView.itemTemplate = element.querySelector(".itemtemplate");
                listView.oniteminvoked = this._itemInvoked.bind(this);
            }.bind(this));
            
            this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            listView.element.focus();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },

        _itemInvoked: function (args) {
            var puzzle = this.list[args.detail.itemIndex];
            WinJS.Navigation.navigate("/pages/puzzle/puzzle.html", { puzzleMeta: puzzle });
        },
        
        refresh: function(){
            var listView = document.querySelector(".itemslist").winControl;
            DAL.whenPuzzleListLoaded(this.type, true).then(function (list) {
                this.list = list;
                listView.itemDataSource = (new WinJS.Binding.List(list)).dataSource;
            }.bind(this));
        }
    });
})();
