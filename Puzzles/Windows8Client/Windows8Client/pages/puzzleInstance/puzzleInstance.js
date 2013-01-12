(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;
    var controller;

    var Controller = WinJS.Class.define(
        function(root) {
            this.rootElement = root;
            this.clockElement = document.getElementById("clock");
            document.getElementById("continueButton").onclick = function(evt) {
                WinJS.Navigation.navigate("pages/home/home.html");
            };
        },
        {
            load: function(puzzleMeta) {
                this.loadPuzzleJS(puzzleMeta.type, function(evt) {
                    this.loadPuzzle(puzzleMeta.id);
                }.bind(this));
            },

            loadPuzzle: function (puzzleId){
                // get the puzzle
                this.puzzle = new Puzzle.Puzzle(Data.getPuzzle(puzzleId), this);
                // initialize the puzzle and load the UI into the page
                this.puzzle.initializeUI(this.rootElement.querySelector("section[role=main] .map"));
                this.solved = false;
                this.startClock();
            },

            loadPuzzleJS: function (puzzleType, callback) {
                var script = document.createElement("script");
                this.rootElement.appendChild(script);
                script.onload = callback;
                script.setAttribute("src", "js/puzzles/" + puzzleType + ".js");
            },
            
            startClock: function () {
                this.startTime = Date.now();
                this.refreshClock();
            },

            refreshClock: function () {
                if (!this.solved) {
                    this.clockElement.textContent = this.formatTimeDiff(Date.now() - this.startTime);
                    window.setTimeout(this.refreshClock.bind(this), 1000);
                }
            },

            formatTimeDiff: function(timediff) {
                var seconds = Math.floor(timediff / 1000);
                var minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;
                return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
            },

            action_solved: function () {
                if (this.solved) return;
                this.solved = true;
                this.endTime = Date.now();
                //document.getElementById("solvingTime").textContent = this.formatTimeDiff(this.endTime - this.startTime);
                var dialog = new Windows.UI.Popups.MessageDialog("Congratulations! Puzzle solved in " + this.formatTimeDiff(this.endTime - this.startTime), "Finished!");
                dialog.commands.append(new Windows.UI.Popups.UICommand("Continue", function() {
                    WinJS.Navigation.navigate("pages/home/home.html");
                }));
                dialog.showAsync().done(function() {
                });
                
                //a.operation.start();
                //document.getElementById("solvedFlyout").winControl.show(
                //    this.rootElement, "top");
            }
        }, {
           // static elements 
        });



    ui.Pages.define("/pages/puzzle/puzzle.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function(element, options) {
            // extract puzzle metadata from options
            var puzzleMeta = (options && options.puzzle) ? options.puzzle : Data.puzzles.getAt(0);
            element.querySelector("header[role=banner] .pagetitle").textContent = puzzleMeta.title;

            controller = new Controller(element);
            controller.load(puzzleMeta);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function(element, viewState, lastViewState) {
        },
        
    });
   
})();

  
