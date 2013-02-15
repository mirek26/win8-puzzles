"use strict";

function PuzzleController(puzzleMeta, element) {
    // the puzzle object
    var puzzle, initialstate;
    
    var canvas;
    var loaded = { "js": false, "css": false, "puzzle": false };

    var stack;
    var solved = false, paused = true;
    var startTime, totalTime;        
    var self = this;
    init();

    function init() {
        canvas = document.createElement("div");
        canvas.className = "canvas " + puzzleMeta.type.toLowerCase();
        element.appendChild(canvas);
        if (puzzleMeta.def) {
            puzzle = puzzleMeta;
            loaded["puzzle"] = true;
        } else {
            DAL.whenPuzzleLoaded(puzzleMeta.id).then(function(response) {
                puzzle = response;
                loadedEvent("puzzle");
            });
        }
        loadJS(puzzleMeta.type);
        loadCSS(puzzleMeta.type);
    }

    function formatTimeDiff(timediff) {
        var seconds = Math.floor(timediff / 1000);
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function startClock() {
        paused = false;
        startTime = Date.now();
    }

    function pauseClock() {
        paused = true;
        totalTime += Date.now() - startTime;
    }

    this.action = function (obj) {
        stack.push(puzzle.getState());
        console.log("ACTION: " + JSON.stringify(obj));
    };

    this.action_solved = function() {
        if (solved) return;
        solved = true;
        var endTime = Date.now();
        if (this.onSolved) {
            this.onSolved();
        }
    };

    // reset the puzzle = start again
    function reset() {
        puzzle.setState(initialstate);
        console.log("RESET");
        stack = [initialstate];
    }

    // undo the last action
    function undo () {
        stack.pop();
        puzzle.setState(stack.last());
        console.log("UNDO");
    }
    
    // load JS for specified puzzle type
    function loadJS(puzzleType) {
        var script = document.createElement("script");
        element.appendChild(script);
        script.onload = loadedEvent.bind(null, "js");
        script.setAttribute("src", "puzzles/" + puzzleType + "/script.js");
    }

    // load JS for specified puzzle type
    function loadCSS(puzzleType) {
        var stylesheet = document.createElement("link");
        document.getElementsByTagName("head")[0].appendChild(stylesheet);
        stylesheet.onload = loadedEvent.bind(null, "css");
        stylesheet.setAttribute("rel", "stylesheet");
        stylesheet.setAttribute("type", "text/css");
        stylesheet.setAttribute("href", 'puzzles/' + puzzleType + '/style.css');
    }

    // function that is call whan some resource is loaded
    function loadedEvent(what) {
        loaded[what] = true;
        if (loaded["js"] == true && loaded["css"] == true && loaded["puzzle"] == true) {
            initialstate = puzzle.istate;
            puzzle = new Puzzle(puzzle, self);
            puzzle.initializeUi(canvas);

            var scale = Math.min(element.clientHeight / canvas.clientHeight, element.clientWidth * 0.9 / canvas.clientWidth, 1.5);
            scale = Math.round(100 * scale) / 100;
            canvas.style["-ms-transform"] = "scale("+scale+")";
            canvas.style.left = (element.clientWidth - scale*canvas.clientWidth) / 2 + "px";

            solved = false;
            stack = [initialstate];
            totalTime = 0;
            startClock();
        }
    }

    this.undo = undo;
    this.undoEnabled = function () { return stack ? stack.length > 1 : false; }
    this.pause = function () { pauseClock(); }
    this.unpause = function () { startClock(); }
    this.reset = reset;
    this.getTime = function () { return formatTimeDiff(paused ? totalTime : totalTime + Date.now() - startTime); }
    this.onSolved = null;
}