(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;
    var controller;

    var Controller = WinJS.Class.define(
        function (root) {
            this.rootElement = root;
            this.clockElement = document.getElementById("clock");
            document.getElementById("continueButton").onclick = function (evt) {
                WinJS.Navigation.navigate("pages/home/home.html");
            };
        },
    {
        loadPuzzle: function (puzzle) {
            this.puzzle = new Puzzle(puzzle, this);
            this.puzzle.initializeUI(this.rootElement.querySelector("section[role=main] .map"));
            this.solved = false;
            this.startClock();
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

        formatTimeDiff: function (timediff) {
            var seconds = Math.floor(timediff / 1000);
            var minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        },

        action: function (obj) {
            console.log(JSON.stringify(obj));
        },

        action_solved: function () {
            if (this.solved) return;
            this.solved = true;
            this.endTime = Date.now();
            //document.getElementById("solvingTime").textContent = this.formatTimeDiff(this.endTime - this.startTime);
            var dialog = new Windows.UI.Popups.MessageDialog("Congratulations! Puzzle solved in " + this.formatTimeDiff(this.endTime - this.startTime), "Finished!");
            dialog.commands.append(new Windows.UI.Popups.UICommand("Continue", function () {
                WinJS.Navigation.navigate("pages/home/home.html");
            }));
            dialog.commands.append(new Windows.UI.Popups.UICommand("Continue with challenge", function () {
                WinJS.Navigation.navigate("pages/home/home.html");
            }));
            dialog.showAsync().done(function () {
            });

            //a.operation.start();
            //document.getElementById("solvedFlyout").winControl.show(
            //    this.rootElement, "top");
        }
    }, {
        // static elements 
    });



    ui.Pages.define("/pages/puzzleInstance/puzzleInstance.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            this.controller = new Controller(element);
            this.rootElement = element;
            this.loaded = { "js": false, "css": false, "puzzle": false };
            if (options.puzzle) {
                this.puzzle = options.puzzle;
                this.loaded.puzzle = true;
            } else if (options.puzzleMeta) {
                this.puzzle = options.puzzleMeta;
                DAL.whenPuzzleLoaded(this.puzzle.id).then(function (puzzle) {
                    this.puzzle = puzzle;
                    this.loadedEvent("puzzle");
                }.bind(this));
            }
            element.querySelector("header[role=banner] .pagetitle").textContent = this.puzzle.name;
            this.loadJS(this.puzzle.type);
            this.loadCSS(this.puzzle.type);
        },

        loadJS: function (puzzleType) {
            var script = document.createElement("script");
            this.rootElement.appendChild(script);
            script.onload = function () { this.loadedEvent("js"); }.bind(this);
            script.setAttribute("src", "puzzles/" + puzzleType + "/script.js");
        },

        loadCSS: function (puzzleType) {
            var stylesheet = document.createElement("link");
            document.getElementsByTagName("head")[0].appendChild(stylesheet);
            stylesheet.onload = function () { this.loadedEvent("css"); }.bind(this);
            stylesheet.setAttribute("rel", "stylesheet");
            stylesheet.setAttribute("type", "text/css");
            stylesheet.setAttribute("href", 'puzzles/' + puzzleType + '/style.css');
        },

        loadedEvent: function (what) {
            this.loaded[what] = true;
            if (this.loaded["js"] == true && this.loaded["css"] == true && this.loaded["puzzle"] == true) {
                this.controller.loadPuzzle(this.puzzle);
            }
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
        },

    });

})();


