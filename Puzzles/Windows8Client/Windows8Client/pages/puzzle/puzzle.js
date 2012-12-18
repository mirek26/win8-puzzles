(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    var definition;
    var gesture;
    var cars;
    var map;
    var startX;
    var startY;
    var size = 100;

    ui.Pages.define("/pages/puzzle/puzzle.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var puzzleMeta = (options && options.puzzle) ? options.puzzle : Data.puzzles.getAt(0);
            element.querySelector("header[role=banner] .pagetitle").textContent = puzzleMeta.title;

            var puzzle = Data.getPuzzle(puzzleMeta.id);
            definition = this.puzzle.definition;
            this._puzzleHTML(element.querySelector("section[role=main] .map"));
            
            map = new Array(definition.size.x);
            for (var i=0; i<definition.size.x; i++){
                map[i] = new Array(definition.size.y);
            }
            cars.forEach(function(car, index){
                x = car.coordinates.x;
                y = car.coordinates.y;
                for (var i=0; i<car.length; i++)
                    map[x + (car.orientation==0)*i][y + (car.orientation==1)*i] = index;
            });

        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
        },

        _puzzleHTML: function (element) {
            var grid = element.querySelector(".grid");
            element.style['width'] = (definition.size.x * size).toString() + "px";
            element.style['height'] = (definition.size.y * size).toString() + "px";
            
            function genTr(len){
                var tr = document.createElement("tr");
                for (var i = 0; i < definition.size.x; i++)
                    tr.appendChild(document.createElement("td"));
                return tr;
            }

            for (var i = 0; i < definition.size.y; i++) {
                grid.appendChild(genTr(definition.size.x));
            }

            cars = new Array();
            definition.cars.forEach(function(car, index){
                var d = this._createNewCar(car, index);            
                element.appendChild(d);
                cars.push(d);
            }, this);

            cars[0].style['background-color'] = "#b11d01";

        },

        _createNewCar: function (car, index) {
            var d = document.createElement('div');
            d.definition = car;
            d.position = { x: car.coordinates.x, y: car.coordinates.y };
            d.index = index;
            d.style['position'] = "absolute";
            d.className += "car";
            if (car.orientation == 1) {
                d.style['-ms-transform'] = "rotate(90deg)";
                d.style['left'] = (car.coordinates.x + 1) * size + "px";
                d.style['top'] = car.coordinates.y*size+ "px";
            } else {
                d.style['left'] = car.coordinates.x * size + "px";
                d.style['top'] = car.coordinates.y * size + "px";
            }
            var colors = ["7200ad", "4617b5", "00485e", "004900", "d39d09", "632f00", "c1004f", "f4b300", "78ba00", "2773ed"];
            d.style['background-color'] = "#" + colors[index];
            d.style['width'] = size * car.length + "px";
            d.style['height'] = size + "px";
            d.setAttribute('id', 'car' + index);

            d.gesture = new MSGesture();
            d.gesture.target = d;
            d.addEventListener("MSGestureStart", this._gestureStart, false);
            d.addEventListener("MSGestureEnd", this._gestureEnd, false);
            d.addEventListener("MSGestureChange", this._gestureChange, false);
            d.addEventListener("MSPointerDown", this._pointerDown, false);
            return d;
        },

        _gestureStart: function (evt) {
            startX = evt.clientX - evt.currentTarget.offsetLeft;
            startY = evt.clientY - evt.currentTarget.offsetTop;
        },

        _gestureEnd: function (evt) {
            evt.currentTarget.style.left = size * Math.round(evt.currentTarget.offsetLeft / size) + "px";
            evt.currentTarget.style.top = size * Math.round(evt.currentTarget.offsetTop / size) + "px";
        },

        _gestureChange: function (evt) {
            if (evt.currentTarget.definition.orientation == 0) {
                var minx = 0;
                var maxx = evt.currentTarget.parentElement.clientWidth - evt.currentTarget.clientWidth;
                var newx = Math.min(maxx, Math.max(minx, evt.clientX - startX));
                evt.currentTarget.style.left = newx + "px";
            } else {
                var miny = 0;
                var maxy = evt.currentTarget.parentElement.clientHeight - evt.currentTarget.clientWidth;
                var newy = Math.min(maxy, Math.max(miny, evt.clientY - startY));
                evt.currentTarget.style.top = newy + "px";
            }
        },

        _pointerDown: function (evt) {
            evt.currentTarget.gesture.addPointer(evt.pointerId);
        },

        _isfree: function (x, y, ignore) {
            for (cars.current.x
        }
    });
})();
