(function() {
    "use strict";

    var list = new WinJS.Binding.List();

    var puzzleTypes = [
        { id: "RushHour", title: "Rush Hour", subtitle: "Move the red car to the exit!" },
        { id: "Sokoban", title: "Sokoban", subtitle: "Move all the boxes to their places!" },
        { id: "Fences", title: "Fences", subtitle: "Blah blah blah!" },
        { id: "Polyominoes", title: "Polyominoes", subtitle: "Put all the pieces in the mold!" }
    ];
    
    var sampleData = [
        { type: "RushHour", id: 101, title: "Rush hour 1", prediction: "0:32" },
        { type: "RushHour", id: 102, title: "Rush hour 2", prediction: "0:54" },
        { type: "RushHour", id: 103, title: "Rush hour 3", prediction: "1:22" },
        { type: "RushHour", id: 104, title: "Rush hour 4", prediction: "1:34" },
        { type: "RushHour", id: 105, title: "Rush hour 5", prediction: "1:53" },
        { type: "RushHour", id: 106, title: "Rush hour 6", prediction: "2:14" },
        { type: "RushHour", id: 107, title: "Rush hour 7", prediction: "2:42" },
        { type: "RushHour", id: 108, title: "Rush hour 8", prediction: "3:52" },
        { type: "RushHour", id: 109, title: "Rush hour 9", prediction: "4:44" }
    ];

    var sampleDefinitions = [
        {
            size: { x: 4, y: 4 },
            cars: [
                { coordinates: { x: 0, y: 1 }, length: 2, orientation: 0 },
                { coordinates: { x: 1, y: 3 }, length: 3, orientation: 0 },
                { coordinates: { x: 3, y: 1 }, length: 2, orientation: 1 },
                { coordinates: { x: 1, y: 0 }, length: 2, orientation: 0 }
            ],
            exit: 0
        },
        {
            size: { x: 6, y: 6 },
            cars: [
                { coordinates: { x: 3, y: 2 }, orientation: 0, length: 2 },
                { coordinates: { x: 0, y: 0 }, orientation: 0, length: 2 },
                { coordinates: { x: 2, y: 0 }, orientation: 1, length: 3 },
                { coordinates: { x: 4, y: 0 }, orientation: 1, length: 2 },
                { coordinates: { x: 5, y: 0 }, orientation: 1, length: 3 },
                { coordinates: { x: 3, y: 3 }, orientation: 1, length: 3 },
                { coordinates: { x: 4, y: 3 }, orientation: 0, length: 2 },
                { coordinates: { x: 0, y: 4 }, orientation: 1, length: 2 },
                { coordinates: { x: 1, y: 4 }, orientation: 0, length: 2 },
                { coordinates: { x: 4, y: 5 }, orientation: 0, length: 2 }],
            exit: 1
        },
        {
            size: { x: 6, y: 6 },
            cars: [
                { coordinates: { x: 4, y: 0 }, orientation: 1, length: 2 },
                { coordinates: { x: 2, y: 2 }, orientation: 0, length: 3 },
                { coordinates: { x: 1, y: 2 }, orientation: 1, length: 3 },
                { coordinates: { x: 0, y: 0 }, orientation: 0, length: 2 },
                { coordinates: { x: 0, y: 5 }, orientation: 0, length: 3 }],
            exit: 0
        }
    ];

    sampleData.forEach(function (item) {
        list.push(item);
    });

    WinJS.Namespace.define("DAL", {
        puzzleTypes: puzzleTypes,
        puzzles: list,
        getPuzzle: getPuzzle,
        getRecommendations: getRecommendations
    });

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

})();
