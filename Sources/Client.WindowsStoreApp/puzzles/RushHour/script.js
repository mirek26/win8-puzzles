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
    var grid;
    
    // constructor
    function init() {
        size = puzzle.definition.size;
        //exit = puzzle.definition.exit;
        exit = puzzle.definition.cars[0].orientation === 0 ? (puzzle.definition.exit * 2 + 3) % 4 : puzzle.definition.exit * 2;
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

    // inicializes the UI
    function initializeUI(element) {
        canvas = document.getElementById("canvas");
        box = document.createElement("div");
        box.style.width = size.x * constants.gridsize - constants.gridspace + "px";
        var height = size.y * constants.gridsize - constants.gridspace;
        box.style.height = height + "px";
        box.style.top = (canvas.offsetHeight - height)/3 + "px";
        canvas.appendChild(box);
        box.className = "box " + ["exit-up", "exit-right", "exit-down", "exit-left"][exit];

        generateGrid();
        generateExit();
        cars.forEach(generateCarElement);
        
        redcar.element.className += " redcar";

        updateUI();
    }

    // 
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

    function generateGrid() {
        grid = new Array(size.x);
        for (var i = 0; i < size.x; i++) {
            grid[i] = new Array(size.y);
        }
        
        var gridEl = document.createElement("table");
        gridEl.setAttribute("id", "grid");
        for (var i = 0; i < size.y; i++) {
            var tr = document.createElement("tr");
            for (var j = 0; j < size.x; j++) {
                var td = document.createElement("td");
                var cell = document.createElement("div");
                grid[j][i] = cell;
                cell.car = null;
                cell.className = "cell";
                td.appendChild(cell);
                tr.appendChild(td);
            }
            gridEl.appendChild(tr);
        }
        box.appendChild(gridEl);
    }

    function generateCarElement(car) {
        var el = document.createElement('div');
        el.className += "car";
        el.car = car;
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
        box.appendChild(el);
    }
            
    function updateUI() {
        // compute coef and scale box
        redcar.element.exitposition = (exit === 0 || exit === 3) ? 0 : constants.gridsize * ((redcar.orientation === 0 ? size.x : size.y) - redcar.length);

        cars.forEach(updateCarPosition);
    }

    function updateCarPosition(car) {
        car.element.style['left'] = grid[car.position.x][car.position.y].offsetLeft + "px";
        car.element.style['top'] = grid[car.position.x][car.position.y].offsetLeft + "px";
        updateGridUnderCar(car);
    }
    
    function updateGridUnderCar(car) {
        function update(cell, occupied, car) {
            if (cell.car === car.index && !occupied) {
                cell.car = null;
            } else if (cell.car === null && occupied) {
                cell.car = car.index;
            } else if (cell.car != car.index && cell.car !== null && occupied) {
                console.log("Ouups..");
            }
        }

        if (car.orientation == 0) {
            car.position.x = null;
            for (var i = 0; i < size.x; i++) {
                var cell = grid[i][car.position.y];
                var occupied = (car.offsetLeft < cell.offsetLeft + cell.offsetWidth && car.offsetLeft + car.offsetWidth < cell.offsetLeft);
                if (occupied && car.position.x === null) {
                    car.position.x = i;
                }
                update(cell, occupied, car);
            }
        } else {
            car.position.y = null;
            for (var i = 0; i < size.y; i++) {
                var cell = grid[car.position.x][i];
                var occupied = (car.offsetTop < cell.offsetTop + cell.offsetHeight && car.offsetTop + car.offsetHeight < cell.offsetTop);
                if (occupied && car.position.y === null) {
                    car.position.y = i;
                }
                update(cell, occupied, car);
            }
        }
    }
   
    function gestureStart(evt) {
        var carEl = evt.currentTarget;
        carEl.oldx = car.position.x;
        carEl.oldy = car.position.y;
        carEl.startX = evt.clientX - carEl.offsetLeft;
        carEl.startY = evt.clientY - carEl.offsetTop;
    }

    function gestureEnd(evt) {
        var carEl = evt.currentTarget;
        var car = carEl.car;
        if (car.position.x != car.oldx || car.position.y != car.oldy) {
            controller.action({ car: car.index, x: car.position.x, y: car.position.y });
            if (carEl.car.index === 0 && (car.orientation === 0 ? car.position.x : car.position.y) * size === carEl.exitposition) {
                controller.action_solved();
            }
        }
        var anim = WinJS.UI.Animation.createRepositionAnimation(carEl);
        updateCarPosition(car);
        anim.execute();
    }

    // gesture change for horizontal cars
    function gestureChangeH (evt) {
        var carEl = evt.currentTarget;
        var car = carEl.car;
        var newposition = evt.clientX - carEl.startX;
        newposition = Math.max(newposition, grid[0][car.position.y].offsetLeft);
        newposition = Math.min(newposition + car.offsetWi, grid[size.x-1][car.position.y].offsetLeft);
        if (carEl.car.index === 0 && newposition == carEl.exitposition) {
            controller.action_solved();
        }
        carEl.style.left = newposition + "px";
        // update map

    }

    // gesture change for vertical cars
    function gestureChangeV (evt) {
        var carEl = evt.currentTarget;
        var newposition = Math.min(carEl.maxposition, Math.max(carEl.minposition, evt.clientY - carEl.startY));
        if (carEl.car.index === 0 && newposition == carEl.exitposition) {
            controller.action_solved();
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