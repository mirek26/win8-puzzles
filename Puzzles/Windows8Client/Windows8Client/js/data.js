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
        return {
            id: puzzleId,
            name: "Rush Hour " + puzzleId,
            definition: (puzzleId <= 104) ? sampleDefinitions[0]:
                        (puzzleId <= 107 ? sampleDefinitions[2] : sampleDefinitions[1])
        };
    }

    function getRecommendations() {
        return {
            easy: sampleData[Math.floor(Math.random() * 4)],
            medium: sampleData[4 + Math.floor(Math.random() * 3)],
            hard: sampleData[7 + Math.floor(Math.random() * 2)]
        };
    }

    WinJS.Namespace.define("DAL", {
        puzzleTypes: puzzleTypes,
        getPuzzles: getPuzzles,
        getPuzzle: getPuzzle,
        getRecommendations: getRecommendations
    });

})();
