(function() {
    "use strict";
 
    var storage = WinJS.Application.local;

    var puzzleTypes = storage.readText("puzzle_types.json", "").done(function(data){
            var obj = JSON.parse(data);
            obj.forEach(function (puzzle) {
                Object.defineProperty(puzzle, "logosrc", { enumerable: true, get: function () { return "puzzles/" + this.id + "/images/logo.png" } });
            });
            return obj;
        });


    function getPuzzles(puzzleType) {
        return storage.readText(puzzleType + "_list.json", "").done(JSON.parse);
    }

    function getPuzzle(puzzleId) {
        var filename = "puzzle_" + puzzleId + ".json";
        return storage.exists(filename).done(function (exits) {
            if (exits) {
                return storage.readText(puzzleType + "_list.json", "").done(JSON.parse);
            } else {
                console.log("Puzzle not found.")
                return null;
            }
        });
    }

    function getRecommendations() {
        return {
            easy: getPuzzle("101"),
            medium: getPuzzle("104"),
            hard: getPuzzle("105")
        };
    }

    WinJS.Namespace.define("DAL", {
        puzzleTypes: puzzleTypes,
        getPuzzles: getPuzzles,
        getPuzzle: getPuzzle,
        getRecommendations: getRecommendations
    });

})();
