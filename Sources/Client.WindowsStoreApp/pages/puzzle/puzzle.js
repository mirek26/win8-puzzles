(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    function Controller(element) {
        var puzzle, solved = false;
        var startTime;
        
        var rootElement = element; 
        var clockElement = document.getElementById("clock");
        
        // buttons of the dialog - put into method and change
        document.getElementById("continueButton").onclick = function(evt) {
            WinJS.Navigation.navigate("pages/home/home.html");
        };

        function formatTimeDiff(timediff) {
            var seconds = Math.floor(timediff / 1000);
            var minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        }

        function loadPuzzle(puzzledef) {
            var canvas = rootElement.querySelector("#canvas");
            canvas.className = puzzledef.type.toLowerCase();
            puzzle = new Puzzle(puzzledef, this);
            puzzle.initializeUi(canvas);

            var scalebox = rootElement.querySelector("#scalebox");
            var scale = Math.min((scalebox.clientHeight * 0.9) / canvas.clientHeight, (scalebox.clientWidth * 0.9) / canvas.clientWidth, 1.5);
            scale = Math.round(100 * scale) / 100;
            canvas.style["-ms-transform"] = "scale("+scale+")";
            canvas.style.left = (scalebox.clientWidth - scale*canvas.clientWidth) / 2 + "px";

            solved = false;
            startClock();
        }

        function startClock() {
            startTime = Date.now();
            refreshClock();
        }

        function refreshClock() {
            if (!solved) {
                clockElement.textContent = formatTimeDiff(Date.now() - startTime);
                window.setTimeout(refreshClock, 1000);
            }
        };

        this.action = function(obj) {
            console.log(obj);
        };

        this.action_solved = function() {
            if (solved) return;
            solved = true;
            var endTime = Date.now();
            var dialog = new Windows.UI.Popups.MessageDialog("Congratulations! Puzzle solved in " + formatTimeDiff(endTime - startTime), "Finished!");
            dialog.commands.append(new Windows.UI.Popups.UICommand("Continue", function() {
                WinJS.Navigation.navigate("pages/home/home.html");
            }));
            dialog.showAsync().done(function() {
            });

            //a.operation.start();
            //document.getElementById("solvedFlyout").winControl.show(
            //    this.rootElement, "top");
        };

        this.loadPuzzle = loadPuzzle;
    }

    ui.Pages.define("/pages/puzzle/puzzle.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function(element, options) {
            this.controller = new Controller(element);
            this.rootElement = element;
            this.loaded = { "js": false, "css": false, "puzzle": false };
            if (options.puzzle) {
                this.puzzle = options.puzzle;
                this.loaded.puzzle = true;
            } else if (options.puzzleMeta) {
                this.puzzle = options.puzzleMeta;
                DAL.whenPuzzleLoaded(this.puzzle.id).then(function(puzzle) {
                    this.puzzle = puzzle;
                    this.loadedEvent("puzzle");
                }.bind(this));
            }
            element.querySelector("header[role=banner] .pagetitle").textContent = this.puzzle.title;
            this.loadJS(this.puzzle.type);
            this.loadCSS(this.puzzle.type);
        },

        loadJS: function (puzzleType) {
            var script = document.createElement("script");
            this.rootElement.appendChild(script);
            script.onload = function() { this.loadedEvent("js"); }.bind(this);
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

        loadedEvent: function(what) {
            this.loaded[what] = true;
            if (this.loaded["js"] == true && this.loaded["css"] == true && this.loaded["puzzle"] == true) {
                this.controller.loadPuzzle(this.puzzle);
            }
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function(element, viewState, lastViewState) {
        },
        
    });
   
})();

  
