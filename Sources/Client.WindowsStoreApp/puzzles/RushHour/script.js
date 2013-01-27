(function () {
    "use strict";

    var Puzzle = WinJS.Class.define(
        // constructor    
        function (puzzle, controller) {
            this.controller = controller;
            this.size = puzzle.definition.size;
            //this.exit = puzzle.definition.exit;
            this.exit = puzzle.definition.cars[0].orientation == 0 ? (puzzle.definition.exit*2+3)%4 : puzzle.definition.exit*2;
            // init car array
            this.cars = new Array();
            var cars = this.cars;
            puzzle.definition.cars.forEach(function (cardef, index) {
                cars.push({
                    position: { x: cardef.position.x, y: cardef.position.y },
                    length: cardef.length, 
                    orientation: cardef.orientation,
                    originalPosition: cardef.position,
                    index: index
                });
            });
            
            this.map = new Array(this.size.x);
            var map = this.map;
            
            for (var i = 0; i < this.size.x; i++) {
                map[i] = new Array(this.size.y);
            }
            this.cars.forEach(this.updateMapUnderCar, this);
        },
        {
            //
            // instance members
            //

            initializeUI: function (element) {
                function generateTr(len) {
                    var tr = document.createElement("tr");
                    for (var i = 0; i < len; i++) {
                        var td = document.createElement("td");
                        var cell = document.createElement("div");
                        cell.className = "cell";
                        td.appendChild(cell);
                        tr.appendChild(td);
                    }
                    return tr;
                }

                function generateGrid(size) {
                    var grid = document.createElement("table");
                    grid.setAttribute("id", "grid");
                    for (var i = 0; i < size.y; i++) {
                        grid.appendChild(generateTr(size.x));
                    }
                    return grid;
                }

                this.canvas = document.getElementById("canvas");
                this.mapEl = document.createElement("div");
                this.mapEl.className = "map " + (new Array("exit-up", "exit-right", "exit-down", "exit-left"))[this.exit];
                this.mapEl.appendChild(generateGrid(this.size));
                this.canvas.appendChild(this.mapEl);
                               
                this.cars.forEach(function (car) {
                    car.element = this.createCarElement(car);
                    this.mapEl.appendChild(car.element);
                }, this);
                
                // red car
                var redcar = this.cars[0];
                redcar.element.className += " redcar";
                
                var exitEl = document.createElement('div');
                exitEl.className = "exit";
                var cell = document.createElement('div');
                cell.className = "cell";
                exitEl.appendChild(cell);
                this.canvas.appendChild(exitEl);

                var grid = document.getElementById('grid');
                var exitquery;
                switch (this.exit) {
                    case 0:
                        exitquery = "tr:first-child td:nth-child(" + (redcar.position.x+1) + ")";
                        break;
                    case 1:
                        exitquery = "tr:nth-child(" + (redcar.position.y+1) + ") td:last-child";
                        break;
                    case 2:
                        exitquery = "tr:last-child td:nth-child(" + (redcar.position.x+1) + ")";
                        break;
                    case 3:
                        exitquery = "tr:nth-child(" + (redcar.position.y+1) + ") td:first-child";
                        break;
                }
                grid.querySelector(exitquery).className += " exit";
                this.updateUI();
            },
            
            updateUI: function (element) {
                var sizespace = Math.floor(Math.min(canvas.offsetWidth / (this.size.x + 2), canvas.offsetHeight / (this.size.y + 2)));
                this.gridSpacing = 4;
                var space = this.gridSpacing;
                this.gridSize = sizespace - space;
                var size = this.gridSize;

                this.mapEl.style.width = this.size.x * sizespace - space + "px";
                this.mapEl.style.height = this.size.y * sizespace - space + "px";

                var cells = document.getElementById("grid").querySelectorAll(".cell");
                for (var i = 0; i < cells.length; ++i) {
                    cells[i].style.width = size + "px";
                    cells[i].style.height = size + "px";
                };

                var car = this.cars[0];
                car.element.exitposition = (this.exit == 0 || this.exit == 3) ? 0 :
                    sizespace * ((car.orientation == 0 ? this.size.x : this.size.y) - car.length);

                this.cars.forEach(function (car) {
                    var el = car.element;
                    var border = 2;
                    var length = sizespace * car.length - space - border + "px";
                    var width = size - border + "px";
                    if (car.orientation == 0) {
                        el.style['width'] = length;
                        el.style['height'] = width;
                    } else {
                        el.style['width'] = width;
                        el.style['height'] = length;
                    }
                });

                this.updateCarPositions();
                this.updateCarsMinMax();
            },

            updateCarPositions: function () {
                var sizespace = this.gridSize + this.gridSpacing;
                this.cars.forEach(function (car) {
                    car.element.style['left'] = car.position.x * sizespace + "px";
                    car.element.style['top'] = car.position.y * sizespace + "px";
                });
            },

            createCarElement: function(car) {
                var el = document.createElement('div');
                el.className += "car";
                el.car = car;
                el.puzzle = this;
                el.setAttribute('id', 'car' + car.index);

                el.gesture = new MSGesture();
                el.gesture.target = el;
                el.addEventListener("MSGestureStart", this.gestureStart, false);
                el.addEventListener("MSGestureEnd", this.gestureEnd, false);
                el.addEventListener("MSGestureChange", car.orientation == 0 ? this.gestureChangeH : this.gestureChangeV, false);
                el.addEventListener("MSPointerDown", this.pointerDown, false);
                return el;
            },
            
           
            
            updateCarsMinMax: function () {
                var size = this.gridSize + this.gridSpacing;
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
                var size = puzzle.gridSize + puzzle.gridSpacing;
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