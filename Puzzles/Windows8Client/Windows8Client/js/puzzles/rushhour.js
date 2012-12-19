(function () {
    "use strict";

    var Puzzle = WinJS.Class.define(
        // constructor    
        function (puzzle, controller) {
            this.controller = controller;
            this.size = puzzle.definition.size;
            this.exit = puzzle.exit;
            // init car array
            this.cars = new Array();
            var cars = this.cars;
            puzzle.definition.cars.forEach(function (cardef, index) {
                cars.push({
                    position: { x: cardef.coordinates.x, y: cardef.coordinates.y },
                    length: cardef.length, 
                    orientation: cardef.orientation,
                    originalPosition: cardef.coordinates,
                    index: index
                });
            });
            
            this.map = new Array(this.size.x);
            var map = this.map;
            
            for (var i = 0; i < this.size.x; i++) {
                map[i] = new Array(this.size.y);
            }
            this.cars.forEach(this.updateMapUnderCar, this);

            this.gridSize = 80;
        },
        {
            //
            // instance members
            //

            initializeUI: function (element) {
                var grid = element.querySelector(".grid");
                element.style['width'] = this.size.x * this.gridSize + "px";
                element.style['height'] = this.size.y * this.gridSize + "px";

                function genTr(len) {
                    var tr = document.createElement("tr");
                    for (var i = 0; i < len; i++)
                        tr.appendChild(document.createElement("td"));
                    return tr;
                }

                for (var i = 0; i < this.size.y; i++) {
                    grid.appendChild(genTr(this.size.x));
                }

                this.cars.forEach(function (car) {
                    car.element = this.createCarElement(car);
                    element.appendChild(car.element);
                }, this);
                
                // red car
                var redcar = this.cars[0];
                redcar.element.style['background-color'] = "#b11d01";
                redcar.element.exitposition = this.exit == 0 ? 0 :
                    this.gridSize * ((redcar.orientation == 0 ? this.size.x : this.size.y) - redcar.length);

                this.updateCarPositions();
                this.updateCarsMinMax();
                
                // exit
                var d = document.createElement('div');
                d.className += "exit";
                d.style.width = this.gridSize + "px"; 
                d.style.height = this.gridSize + "px";
                d.textContent = "EXIT";
                d.style.position = "absolute";
                if (redcar.orientation == 0) {
                    d.style.left = (this.exit == 0 ? -this.gridSize : this.size.x * this.gridSize) + "px";
                    d.style.top = redcar.position.y * this.gridSize + "px";
                } else {
                    d.style.top = (this.exit == 0 ? -this.gridSize : this.size.y * this.gridSize) + "px";
                    d.style.left = redcar.position.x * this.gridSize + "px";
                }
                element.appendChild(d);
            },
            
            createCarElement: function(car) {
                var d = document.createElement('div');
                d.style['position'] = "absolute";
                d.className += "car";
                d.car = car;
                d.puzzle = this;

                var colors = ["7200ad", "4617b5", "00485e", "004900", "d39d09", "632f00", "c1004f", "f4b300", "78ba00", "2773ed"];
                d.style['background-color'] = "#" + colors[car.index];
                if (car.orientation == 0) {
                    d.style['width'] = this.gridSize * car.length + "px";
                    d.style['height'] = this.gridSize + "px";
                } else {
                    d.style['width'] = this.gridSize + "px";
                    d.style['height'] = this.gridSize * car.length + "px";
                }
                d.setAttribute('id', 'car' + car.index);

                d.gesture = new MSGesture();
                d.gesture.target = d;
                d.addEventListener("MSGestureStart", this.gestureStart, false);
                d.addEventListener("MSGestureEnd", this.gestureEnd, false);
                d.addEventListener("MSGestureChange", car.orientation == 0 ? this.gestureChangeH : this.gestureChangeV, false);
                d.addEventListener("MSPointerDown", this.pointerDown, false);
                return d;
            },
            
            updateCarPositions: function () {
                var size = this.gridSize;
                this.cars.forEach(function(car) {
                    car.element.style['left'] = car.position.x * size + "px";
                    car.element.style['top'] = car.position.y * size + "px";
                });
            },
            
            updateCarsMinMax: function () {
                var size = this.gridSize;
                this.cars.forEach(function (car) {
                    if (car.orientation == 0) {
                        var x = car.position.x - 1;
                        while (x >= 0 && this.map[x][car.position.y] == null) x--;
                        car.element.minposition = (x + 1) * size;
                        x = car.position.x + car.length;
                        while (x < this.size.x && this.map[x][car.position.y] == null) x++;
                        car.element.maxposition = (x - car.length) * size;
                    } else {
                        var y = car.position.y - 1;
                        while (y >= 0 && this.map[car.position.x][y] == null) y--;
                        car.element.minposition = (y + 1) * size;
                        y = car.position.y + car.length;
                        while (y < this.size.y && this.map[car.position.x][y] == null) y++;
                        car.element.maxposition = (y - car.length) * size;
                    }
                }, this);
            },
            
            updateMapUnderCar: function(car, value) {
                for (var i = 0; i < car.length; i++)
                    this.map[car.position.x + (car.orientation == 0) * i][car.position.y + (car.orientation == 1) * i] = value;
            },

            gestureStart: function (evt) {
                var carEl = evt.currentTarget;
                carEl.startX = evt.clientX - carEl.offsetLeft;
                carEl.startY = evt.clientY - carEl.offsetTop;
            }, 

            gestureEnd: function (evt) {
                var carEl = evt.currentTarget;
                var car = carEl.car;
                var puzzle = carEl.puzzle;
                var size = puzzle.gridSize;
                var newx = Math.round(carEl.offsetLeft / size);
                var newy = Math.round(carEl.offsetTop / size);
                if (newx != car.position.x || newy != car.position.y) {
                    puzzle.updateMapUnderCar(car, null);
                    car.position.x = newx;
                    car.position.y = newy;
                    puzzle.updateMapUnderCar(car, car.index);
                    puzzle.updateCarsMinMax();
                    if (carEl.car.index == 0 && (car.orientation==0?newx:newy)*size == carEl.exitposition) {
                        carEl.puzzle.controller.action_solved();
                    }
                }
                var anim = WinJS.UI.Animation.createRepositionAnimation(carEl);
                carEl.style.left = newx * size + "px";
                carEl.style.top = newy * size + "px";
                anim.execute();
            },

            // gesture change for horizontal cars
            gestureChangeH: function (evt) {
                var carEl = evt.currentTarget;
                var newposition = Math.min(carEl.maxposition, Math.max(carEl.minposition, evt.clientX - carEl.startX));
                if (carEl.car.index == 0 && newposition == carEl.exitposition) {
                    carEl.puzzle.controller.action_solved();
                }
                carEl.style.left = newposition + "px";
            },

            // gesture change for vertical cars
            gestureChangeV: function (evt) {
                var carEl = evt.currentTarget;
                var newposition = Math.min(carEl.maxposition, Math.max(carEl.minposition, evt.clientY - carEl.startY));
                if (carEl.car.index == 0 && newposition == carEl.exitposition) {
                    carEl.puzzle.controller.action_solved();
                }
                carEl.style.top = newposition + "px";
            },

            pointerDown: function (evt) {
                evt.currentTarget.gesture.addPointer(evt.pointerId);
            }

        }, {
            // static members go here
        });


    WinJS.Namespace.define("Puzzle", {
        Puzzle: Puzzle
    });

})();