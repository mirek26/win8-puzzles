"use strict";

function Puzzle(puzzle, controller) {
    // PRIVATE FIELDS
    // basic definition
    var size, exit, cars, redcar;

    // html elements
    var canvas, box; 
    var constants = {
        gridsize: 100,
        gridspace: 8,
        carborder: 4
    };

    // helper structures
    var map;
    
    function init() {
        size = puzzle.definition.size;
        //exit = puzzle.definition.exit;
        exit = puzzle.definition.cars[0].orientation === 0 ? (puzzle.definition.exit * 2 + 3) % 4 : puzzle.definition.exit * 2;
        initCars();
        initMap();
    }

    function initCars() {
        cars = [];
        puzzle.definition.cars.forEach(function (cardef, index) {
            cars.push({
                position: { x: cardef.position.x, y: cardef.position.y },
                length: cardef.length, 
                orientation: cardef.orientation,
                originalPosition: cardef.position,
                index: index
            });
        });
        redcar = cars[0];
    }

    function initMap() {
        map = new Array(size.x);
        for (var i = 0; i < size.x; i++) {
            map[i] = new Array(size.y);
        }
        cars.forEach(updateMapUnderCar);
    }

    function initializeUI (element) {
        canvas = document.getElementById("canvas");
        box = document.createElement("div");
        box.style.width = size.x * constants.gridsize - constants.gridspace + "px";
        var height = size.y * constants.gridsize - constants.gridspace;
        box.style.height = height + "px";
        box.style.top = (canvas.offsetHeight - height)/3 + "px";
        canvas.appendChild(box);
        box.className = "box " + ["exit-up", "exit-right", "exit-down", "exit-left"][exit];
        box.appendChild(generateGrid(size));
        generateExit();                       

        cars.forEach(function (car) {
            car.element = createCarElement(car);
            box.appendChild(car.element);
        });
        redcar.element.className += " redcar";
        
        
        updateUI();
    }

    function generateExit (element) {
        box.innerHTML += '<div class="exit"><div class="cell"></div></div>';
        var exitEl = box.querySelector('div.exit');

        var grid = document.getElementById('grid');
        var exitquery;
        switch (exit) {
            case 0:
                exitquery = "tr:first-child td:nth-child(" + (redcar.position.x+1) + ")";
                exitEl.style.left = redcar.position.x * constants.gridsize - constants.gridspace + "px";
                exitEl.style.top = "0px";
                break;
            case 1:
                exitquery = "tr:nth-child(" + (redcar.position.y+1) + ") td:last-child";
                exitEl.style.left = size.x * constants.gridsize - constants.gridspace + "px";
                exitEl.style.top = redcar.position.y * constants.gridsize - constants.gridspace + "px";
                break;
            case 2:
                exitquery = "tr:last-child td:nth-child(" + (redcar.position.x+1) + ")";
                exitEl.style.left = (redcar.position.x+1) * constants.gridsize + "px";
                exitEl.style.top = size.y * constants.gridsize - constants.gridspace + "px";
                break;
            case 3:
                exitquery = "tr:nth-child(" + (redcar.position.y+1) + ") td:first-child";
                exitEl.style.right = 0 + "px";
                exitEl.style.top = redcar.position.y * constants.gridsize - constants.gridspace + "px";
                break;
        }
        grid.querySelector(exitquery).className += " exit";
    }

    function generateGrid(size) {
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
        var grid = document.createElement("table");
        grid.setAttribute("id", "grid");
        for (var i = 0; i < size.y; i++) {
            grid.appendChild(generateTr(size.x));
        }
        return grid;
    }

    function createCarElement(car) {
        var el = document.createElement('div');
        el.className += "car";
        el.car = car;
        el.puzzle = this;
        el.setAttribute('id', 'car' + car.index);

        var length = constants.gridsize * car.length - constants.gridspace - constants.carborder + "px";
        var width = constants.gridsize - constants.gridspace - constants.carborder + "px";
        if (car.orientation === 0) {
            el.style['width'] = length;
            el.style['height'] = width;
        } else {
            el.style['width'] = width;
            el.style['height'] = length;
        }

        el.gesture = new MSGesture();
        el.gesture.target = el;
        el.addEventListener("MSGestureStart", gestureStart, false);
        el.addEventListener("MSGestureEnd", gestureEnd, false);
        el.addEventListener("MSGestureChange", car.orientation === 0 ? gestureChangeH : gestureChangeV, false);
        el.addEventListener("MSPointerDown", pointerDown, false);
        return el;
    }
            
    function updateUI() {
        // compute coef and scale box
        redcar.element.exitposition = (exit === 0 || exit === 3) ? 0 : constants.gridsize * ((redcar.orientation === 0 ? size.x : size.y) - redcar.length);

        updateCarPositions();
        updateCarsMinMax();
    }

    function updateCarPositions() {
        cars.forEach(function (car) {
            car.element.style['left'] = car.position.x * constants.gridsize + "px";
            car.element.style['top'] = car.position.y * constants.gridsize + "px";
        });
    }

    function updateCarsMinMax() {
        var size = constants.gridsize;
        cars.forEach(function (car) {
            if (car.orientation === 0) {
                var x = car.position.x - 1;
                while (x >= 0 && map[x][car.position.y] === null) { x--; } 
                car.element.minposition = (x + 1) * size;
                x = car.position.x + car.length;
                while (x < size.x && map[x][car.position.y] === null) { x++; }
                car.element.maxposition = (x - car.length) * size;
            } else {
                var y = car.position.y - 1;
                while (y >= 0 && map[car.position.x][y] === null) { y--; }
                car.element.minposition = (y + 1) * size;
                y = car.position.y + car.length;
                while (y < size.y && map[car.position.x][y] === null) { y++; } 
                car.element.maxposition = (y - car.length) * size;
            }
        });
    }
            
    function updateMapUnderCar(car, value) {
        for (var i = 0; i < car.length; i++) {
            map[car.position.x + (car.orientation === 0) * i][car.position.y + (car.orientation === 1) * i] = value;
        }
    }

    function gestureStart(evt) {
        var carEl = evt.currentTarget;
        carEl.startX = evt.clientX - carEl.offsetLeft;
        carEl.startY = evt.clientY - carEl.offsetTop;
    }

    function gestureEnd(evt) {
        var carEl = evt.currentTarget;
        var car = carEl.car;
        var puzzle = carEl.puzzle;
        var newx = Math.round(carEl.offsetLeft / constants.gridsize);
        var newy = Math.round(carEl.offsetTop / constants.gridsize);
        if (newx != car.position.x || newy != car.position.y) {
            puzzle.updateMapUnderCar(car, null);
            car.position.x = newx;
            car.position.y = newy;
            puzzle.updateMapUnderCar(car, car.index);
            puzzle.updateCarsMinMax();
            if (carEl.car.index === 0 && (car.orientation === 0 ? newx : newy) * size === carEl.exitposition) {
                carEl.puzzle.controller.action_solved();
            }
        }
        var anim = WinJS.UI.Animation.createRepositionAnimation(carEl);
        carEl.style.left = newx * size + "px";
        carEl.style.top = newy * size + "px";
        anim.execute();
    }

    // gesture change for horizontal cars
    function gestureChangeH (evt) {
        var carEl = evt.currentTarget;
        var newposition = Math.min(carEl.maxposition, Math.max(carEl.minposition, evt.clientX - carEl.startX));
        if (carEl.car.index === 0 && newposition === carEl.exitposition) {
            carEl.puzzle.controller.action_solved();
        }
        carEl.style.left = newposition + "px";
    }

    // gesture change for vertical cars
    function gestureChangeV (evt) {
        var carEl = evt.currentTarget;
        var newposition = Math.min(carEl.maxposition, Math.max(carEl.minposition, evt.clientY - carEl.startY));
        if (carEl.car.index === 0 && newposition === carEl.exitposition) {
            carEl.puzzle.controller.action_solved();
        }
        carEl.style.top = newposition + "px";
    }

    function pointerDown (evt) {
        evt.currentTarget.gesture.addPointer(evt.pointerId);
    }

    function getState () {
        return { };
    }

    function setState () {

    }

    // PUBLIC FIELDS
    this.initializeUI = initializeUI;
    this.updateUI = updateUI;
    this.getState = getState;
    this.setState = setState;

    init();
};