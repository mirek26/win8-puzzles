(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;
    var self;

    ui.Pages.define("/pages/puzzle/puzzle.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            self = this;
            document.getElementById("continueButton").onclick = function(evt) {
                WinJS.Navigation.navigate("pages/home/home.html");
            };

            this.rootElement = element;
            var puzzleMeta = options.puzzle ? options.puzzle : options.puzzleMeta;
            this.puzzleMeta = puzzleMeta;
            element.querySelector("header[role=banner] .pagetitle").textContent = puzzleMeta.title;
            var scalebox = document.getElementById("scalebox");
            this.controller = new PuzzleController(puzzleMeta, scalebox);
            this.controller.onSolved = this.solved;
            document.getElementById("resetButton").addEventListener("click", this.reset);
            document.getElementById("undoButton").addEventListener("click", this.undo);
            document.getElementById("pauseButton").addEventListener("click", this.pause);
            this.refreshClock();
        },

        solved: function(){
            var dialog = new Windows.UI.Popups.MessageDialog("Congratulations! Puzzle solved in " + self.controller.getTime(), "Finished!");
            dialog.commands.append(new Windows.UI.Popups.UICommand("Continue", function() {
                WinJS.Navigation.navigate("pages/list/list.html", { type: self.puzzleMeta.type });
            }));
            dialog.showAsync().done(function() {
            });
        },

        refreshClock: function () {
            var clock = document.getElementById("clock");
            if (clock == undefined) return;
            clock.textContent = self.controller.getTime();
            document.getElementById("undoButton").disabled = !self.controller.undoEnabled();
            window.setTimeout(self.refreshClock, 1000);
        },

        pause: function (){
            self.controller.pause();
            var dialog = new Windows.UI.Popups.MessageDialog("Taking a break? That's fine, but don't dare cheat and think about the puzzle now! :-)", "Paused");
            dialog.commands.append(new Windows.UI.Popups.UICommand("Continue", function () {
                self.controller.unpause();
            }));
            dialog.showAsync().done(function () {
            });
        },

        undo: function () {
            self.controller.undo();
            document.getElementById("undoButton").disabled = !self.controller.undoEnabled();
        },

        reset: function () {
            self.controller.reset();
            document.getElementById("undoButton").disabled = !self.controller.undoEnabled();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function(element, viewState, lastViewState) {
        },
    });
   
})();

  
