(function() {
    "use strict";
 
    var storage = WinJS.Application.local;

    var puzzlesUrl = "http://puzzles.azurewebsites.net/api/";

    function fileFromPath(path) {
        return path.replace("/", "_") + ".json";
    }

    function getFromApi(path) {
        return WinJS.xhr({ url: puzzlesUrl + path, responseType: "json"}).then(
            function(result) {
                storage.writeText(fileFromPath(path), result.response);
                return JSON.parse(result.response);
            }
        );
    }

    function getFromFileOrApi(path, reload) {
        var filename = fileFromPath(path);
        if (reload) {
            return getFromApi(path);
        }
        
        return storage.exists(filename).then(function(exists) {
            if (exists) {
                return storage.readText(filename, "null").then(JSON.parse);
            } else {
                return getFromApi(path);
            }
        });
    }

    function whenPuzzleTypesLoaded(reload) {
        return getFromFileOrApi("puzzles", reload).then( function (types) {
            types.forEach(function(puzzle) {
                Object.defineProperty(puzzle, "logosrc", { enumerable: true, get: function() { return "puzzles/" + this.id + "/images/logo.png"; } });
            });

            return types;
        });
    }

    function whenPuzzleListLoaded(puzzleType, reload) {
        return getFromFileOrApi("puzzles/" + puzzleType, reload);
    }

    function whenPuzzleLoaded(puzzleId, reload) {
        return getFromFileOrApi("puzzle/" + puzzleId, reload);
    }

    function whenRecommendationsLoaded(type) {
        return WinJS.Promise.join([whenPuzzleLoaded("10"), whenPuzzleLoaded("40"), whenPuzzleLoaded("50")]);
    }

    WinJS.Namespace.define("DAL", {
        whenPuzzleTypesLoaded: whenPuzzleTypesLoaded,
        whenPuzzleListLoaded: whenPuzzleListLoaded,
        whenPuzzleLoaded: whenPuzzleLoaded,
        whenRecommendationsLoaded: whenRecommendationsLoaded
    });

})();
