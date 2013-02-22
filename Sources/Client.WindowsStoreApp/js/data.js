(function() {
    "use strict";
 
    var storage = WinJS.Application.local;

    // provisional path to the definitions in package
    var packagefolder = Windows.ApplicationModel.Package.current.installedLocation;
    
    // Path to the API
    var puzzlesUrl = "http://puzzles.azurewebsites.net/api/";
    var cache = {};

    function fileFromPath(path) {
        return path.replace("/", "_") + ".json";
    }

    function getFromApi(path) {
        //return WinJS.xhr({ url: puzzlesUrl + path, responseType: "json"}).then(
        //    function(result) {
        //        storage.writeText(fileFromPath(path), result.response);
        //        var obj = JSON.parse(result.response);
        //        cache[path] = obj;
        //        return obj;
        //    }
        //);
        return packagefolder.getFolderAsync("fakeAPI").then(function (folder) {
            return folder.getFileAsync(fileFromPath(path));
        }).then(function (file) {
            return Windows.Storage.FileIO.readTextAsync(file);
        }).then(function (str) {
            storage.writeText(fileFromPath(path), str);
            var obj = JSON.parse(str);
            cache[path] = obj;
            return obj;
        });
    }

    function updatePuzzle(puzzle) {
        // puzzle
        var path = "puzzle/" + puzzle.id;
        cache[path] = puzzle;
        storage.writeText(fileFromPath(path), JSON.stringify(puzzle));
        // in list
        path = "puzzles/" + puzzle.type;
        whenPuzzleListLoaded(puzzle.type).then(function (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id != puzzle.id) continue;
                list[i].solved = puzzle.solved;
                list[i].spend = puzzle.spend;
            }
            cache[path] = list;
            storage.writeText(fileFromPath(path), JSON.stringify(list));
        });
    }

    function getFromCacheFileOrApi(path, reload) {
        if (cache[path]) return WinJS.Promise.as(cache[path]);
        var filename = fileFromPath(path);
        if (reload) {
            return getFromApi(path);
        }
        
        return storage.exists(filename).then(function(exists) {
            if (exists) {
                return storage.readText(filename, "null").then(function (str) {
                    var obj = JSON.parse(str);
                    cache[path] = obj;
                    return obj;
                });
            } else {
                return getFromApi(path);
            }
        });
    }

    function whenPuzzleTypesLoaded(reload) {
        return getFromCacheFileOrApi("puzzles", reload).then( function (types) {
            types.forEach(function (puzzle) {
                puzzle.logosrc = "puzzles/" + puzzle.id + "/images/logo.png";
            });

            return types;
        });
    }

    function whenPuzzleListLoaded(puzzleType, reload) {
        return getFromCacheFileOrApi("puzzles/" + puzzleType, reload).then( function (list) {
            list.forEach(function (puzzle) {
                puzzle.stateclass = puzzle.solved ? "stateg" : puzzle.spend == null ? "stateo" : "stater";
                puzzle.statetext = puzzle.solved ? "Solved in " + puzzle.spend : "Median: " + puzzle.expected;
            });

            return list;
        });
    }

    function whenPuzzleLoaded(puzzleId, reload) {
        return getFromCacheFileOrApi("puzzle/" + puzzleId, reload);
    }

    WinJS.Namespace.define("DAL", {
        whenPuzzleTypesLoaded: whenPuzzleTypesLoaded,
        whenPuzzleListLoaded: whenPuzzleListLoaded,
        whenPuzzleLoaded: whenPuzzleLoaded,
        updatePuzzle: updatePuzzle
    });

})();
