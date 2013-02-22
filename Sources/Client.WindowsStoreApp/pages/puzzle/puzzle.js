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
            this.rootElement = element;
            var puzzleMeta = options.puzzle ? options.puzzle : options.puzzleMeta;
            this.puzzleMeta = puzzleMeta;
            element.querySelector("header[role=banner] .pagetitle").textContent = puzzleMeta.title;
            var scalebox = document.getElementById("scalebox");
            this.controller = new PuzzleController(puzzleMeta, scalebox);
            //this.controller.onLoad = this.solved;
            this.controller.onSolved = this.solved;
            document.getElementById("resetButton").addEventListener("click", this.reset);
            document.getElementById("undoButton").addEventListener("click", this.undo);
            document.getElementById("pauseButton").addEventListener("click", this.pause);
            this.refreshClock();

            document.getElementById("backbutton").addEventListener("click", function (evt) {
                self.controller.pause();
                var dialog = new Windows.UI.Popups.MessageDialog("You can surely solve this, it just takes some time...", "Give up?");
                dialog.commands.append(new Windows.UI.Popups.UICommand("Give up", function () {
                    WinJS.Navigation.navigate("/pages/rules/rules.html", puzzleMeta.type);
                }));
                dialog.commands.append(new Windows.UI.Popups.UICommand("Continue", function () { }));
                dialog.showAsync().done(function () {
                    self.controller.unpause();
                });
            }, false);
        },

        solved: function () {
            var puzzle = self.controller.puzzle;
            $("#dialog .actualTime").text(formatTime(self.controller.getTime()));
            $("#dialog .meanTime").text(puzzle.mean);
            $("#dialog .medianTime").text(puzzle.median);
            $("#dialog").show();
            timehistogram($("#dialog .histogram")[0], puzzle.hist.len, puzzle.hist.values, self.controller.getTime() / 1000);
            var message = $("#dialog .message");
            message.offset({ top: ($("body")[0].offsetHeight - message[0].offsetHeight) / 2 });
            $("#dialog .seeAllButton").click(function () {
                WinJS.Navigation.navigate("/pages/list/list.html", { type: puzzle.type });
            });
            DAL.whenPuzzleListLoaded(puzzle.type).then(function (list) {
                var unsolved = list.filter(function (p) { return p.solved == false });
                if (unsolved.length == 0) {
                    $("#dialog .continueButtons").hide();
                    $("#dialog .allSolved").show();
                    $("#dialog .home").click(function () {
                        WinJS.Navigation.navigate("/pages/home/home.html");
                    });
                    return;
                }

                var harder = unsolved.filter(function (p) { return p.expected > puzzle.expected })
                var e, h;
                if (harder.length !== 0) {
                    e = harder[random(0, Math.min(4, harder.length))];
                    h = harder[random(Math.min(3, harder.length-1), Math.min(8, harder.length))];
                } else {
                    e = unsolved.last();
                    h = unsolved.last();
                }
                $("#dialog .easier").click(function () {
                    WinJS.Navigation.navigate("/pages/puzzle/puzzle.html", { puzzleMeta: e });
                });
                $("#dialog .harder").click(function () {
                    WinJS.Navigation.navigate("/pages/puzzle/puzzle.html", { puzzleMeta: h });
                });
            });

            puzzle.solved = true;
            puzzle.spend = formatTime(self.controller.getTime());
            DAL.updatePuzzle(puzzle);
        },

        refreshClock: function () {
            var clock = document.getElementById("clock");
            if (clock == undefined) return;
            clock.textContent = formatTime(self.controller.getTime());
            document.getElementById("undoButton").disabled = !self.controller.undoEnabled();
            window.setTimeout(self.refreshClock, 1000);
        },

        pause: function (){
            self.controller.pause();
            var dialog = new Windows.UI.Popups.MessageDialog("Taking a break? All right, but don't dare to cheat and think about it now! :-)", "Paused");
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

  
