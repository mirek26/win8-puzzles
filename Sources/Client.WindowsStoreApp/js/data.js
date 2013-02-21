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

    function getFromCacheFileOrApi(path, reload) {
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
            types.forEach(function(puzzle) {
                Object.defineProperty(puzzle, "logosrc", { enumerable: true, get: function() { return "puzzles/" + this.id + "/images/logo.png"; } });
            });

            return types;
        });
    }

    function whenPuzzleListLoaded(puzzleType, reload) {
        return getFromCacheFileOrApi("puzzles/" + puzzleType, reload);
    }

    function whenPuzzleLoaded(puzzleId, reload) {
        return getFromCacheFileOrApi("puzzle/" + puzzleId, reload);
    }

    WinJS.Namespace.define("DAL", {
        whenPuzzleTypesLoaded: whenPuzzleTypesLoaded,
        whenPuzzleListLoaded: whenPuzzleListLoaded,
        whenPuzzleLoaded: whenPuzzleLoaded,
    });

})();
