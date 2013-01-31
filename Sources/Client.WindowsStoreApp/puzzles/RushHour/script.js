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

        map = new Array(size.x);
        for (var i = 0; i < size.x; i++) {
            map[i] = new Array(size.y);
            for (var j = 0; j < size.y; j++) {
                map[i][j] = null;
            }
        }
        cars.forEach(function(car){
            for (var i = 0; i < car.length; i++) {
                map[car.position.x + (car.orientation === 0) * i][car.position.y + (car.orientation === 1) * i] = car.index;
            }
        });
    }

    function initializeUi (element) {
        canvas = element;

        // box
        box = document.createElement("div");
        box.className = "box " + ["exit-up", "exit-right", "exit-down", "exit-left"][exit];
        canvas.appendChild(box);
        
        // grid and exit
        generateGrid();
        generateExit();                       

        // all cars
        cars.forEach(generateCar);
        redcar.element.className += " redcar";

        // update box dimensions
        var grid = box.querySelector(".grid");
        box.style.width = grid.clientWidth + "px";
        box.style.height = grid.clientHeight + "px";
        box.style.top = (canvas.clientHeight - grid.clientHeight)/3 + "px";
        
        // update positions and scaling
        updateUi();
    }

    function generateExit() {
        box.innerHTML += '<div class="exit"><div class="cell"></div></div>';
        var exitEl = box.querySelector('div.exit');
        var grid = box.querySelector('.grid');
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

    // generates grid (table) and appends to box
    function generateGrid() {
        var grid = document.createElement("table");
        grid.className = "grid";
        for (var i = 0; i < size.y; i++) {
            var tr = document.createElement("tr");
            for (var j = 0; j < size.x; j++) {
                var td = document.createElement("td");
                var cell = document.createElement("div");
                cell.className = "cell";
                td.appendChild(cell);
                tr.appendChild(td);
            }
            grid.appendChild(tr);
        }
        box.appendChild(grid);
    }

    // generates car dom element corresponding to given car object, appends to box 
    function generateCar(car) {
        var el = document.createElement('div');
        el.className += "car";
        el.car = car;
        car.element = el;
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
        box.appendChild(el);
    }
            
    function updateUi() {
        // compute coef and scale box
        updateCarPositions();
    }

    function updateCarPositions() {
        cars.forEach(function (car) {
            car.element.style['left'] = car.position.x * constants.gridsize + "px";
            car.element.style['top'] = car.position.y * constants.gridsize + "px";
            car.element.posL = car.orientation == 0 ? car.position.x : car.position.y;
            car.element.posR = car.element.posL + car.length - 1;
        });
    }

    function gestureStart(evt) {
        var carEl = evt.currentTarget;
        carEl.startX = evt.clientX - evt.offsetX;
        carEl.startY = evt.clientY - evt.offsetY;
    }

    function gestureEnd(evt) {
        var carEl = evt.currentTarget;
        var car = carEl.car;
        var newx = Math.round(carEl.offsetLeft / constants.gridsize);
        var newy = Math.round(carEl.offsetTop / constants.gridsize);
        if (newx != car.position.x || newy != car.position.y) {
            controller.action("posun vole");
            car.position.x = newx;
            car.position.y = newy;
            puzzle.updateMapUnderCar(car, car.index);
        }
        //var anim = WinJS.UI.Animation.createRepositionAnimation(carEl);
        carEl.style.left = newx * constants.gridsize + "px";
        carEl.style.top = newy * constants.gridsize + "px";
        //anim.execute();
    }

    function moveCarH(carEl, position){
        carEl.posL = Math.floor( (position + constants.gridspace) / constants.gridsize);
        carEl.posR = Math.floor( (position + carEl.offsetWidth) / constants.gridsize);
        var y = carEl.car.position.y;
        var i;
        var unset = function(){ if (map[i][y] == carEl.car.index) map[i][y] = null; }
        var set = function(){ map[i][y] = carEl.car.index; }
        for (i = 0; i < carEl.posL; i++) unset();
        for (; i <= carEl.posR; i++) set();
        for (; i < size.x; i++) set();
        carEl.style.left = position + "px";
    }

    // gesture change for horizontal cars
    function gestureChangeH (evt) {
        var carEl = evt.currentTarget;
        var req = evt.clientY - carEl.startY;
        console.log(req);
        if (evt.translationX > 0) {
            var pos = Math.floor( (req + carEl.offsetWidth) / constants.gridsize );
            if (carEl.posR < pos) {
                var y = carEl.car.position.y;
                var ok = carEl.posR + 1;
                while (ok < pos && ok < size.x && map[ok][y] === null) ok++;
                if (ok == size.x){
                    if (carEl.car.index == 0 && exit == 1) controller.action_solved();
                    else req = ok * constants.gridsize - carEl.offsetWidth;
                } else if (map[ok][y] !== null){
                    req = ok * constants.gridsize - carEl.offsetWidth;
                }   
                moveCarH(carEl, req);
            } 
        } else {
            var pos = Math.floor( (req + carEl.offsetWidth) / constants.gridsize );
            if (pos < carEl.posL) {
                var y = carEl.car.position.y;
                var ok = carEl.posL - 1;
                while (pos < ok && 0 <= ok && map[ok][y] === null) ok--;
                if (ok == -1){
                    if (carEl.car.index == 0 && exit == 3) controller.action_solved();
                    else req = 0;
                } else if (map[ok][y] !== null){
                    req = (ok + 1) * constants.gridsize - constants.gridspace;
                }   
                moveCarH(carEl, req);
            }
        }
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
    this.initializeUi = initializeUi;
    this.updateUi = updateUi;
    this.getState = getState;
    this.setState = setState;

    init();
};