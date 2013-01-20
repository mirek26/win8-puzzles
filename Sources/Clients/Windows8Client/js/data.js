(function() {
    "use strict";
 
    var storage = WinJS.Application.local;

    var puzzleTypes;

    function whenPuzzleTypesLoaded() {
        return storage.readText("puzzle_types.json", "[]").then(function(data) {
            var obj = JSON.parse(data);
            obj.forEach(function(puzzle) {
                Object.defineProperty(puzzle, "logosrc", { enumerable: true, get: function() { return "puzzles/" + this.id + "/images/logo.png"; } });
            });
            return obj;
        });
    }

    function whenPuzzleListLoaded(puzzleType) {
        return storage.readText(puzzleType + "_list.json", "[]").then(JSON.parse);
    }

    function whenPuzzleLoaded(puzzleId) {
        var filename = "puzzle_" + puzzleId + ".json";
        return storage.exists(filename).then(function (exits) {
            if (exits) {
                return storage.readText(filename).then(JSON.parse);
            } else {
                console.log("Puzzle not found.");
                return null;
            }
        });
    }

    function whenRecommendationsLoaded(type) {
        var easy, medium, hard;
        var easyLoaded = whenPuzzleLoaded("10").then(function (puzzle) { easy = puzzle; });
        var mediumLoaded = whenPuzzleLoaded("40").then(function (puzzle) { medium = puzzle; });
        var hardLoaded = whenPuzzleLoaded("50").then(function (puzzle) { hard = puzzle; });
        return WinJS.Promise.join([easyLoaded, mediumLoaded, hardLoaded]).then(function () {
            return { easy: easy, medium: medium, hard: hard };
        });
    }

    WinJS.Namespace.define("DAL", {
        whenPuzzleTypesLoaded: whenPuzzleTypesLoaded,
        whenPuzzleListLoaded: whenPuzzleListLoaded,
        whenPuzzleLoaded: whenPuzzleLoaded,
        whenRecommendationsLoaded: whenRecommendationsLoaded
    });

})();
