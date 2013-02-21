"use strict";

function Puzzle(puzzle, controller) {
    // PRIVATE FIELDS
    // basic def
    var def, cars, redcar;

    // html elements
    var canvas, box; 
    var constants = {
        gridsize: 100,
        gridspace: 8,
        carborder: 4
    };

    // helper structures
    var map, solved = false;
    
    function init() {
        def = puzzle.def;

        map = new Array(def.size[0]);
        for (var i = 0; i < def.size[0]; i++) {
            map[i] = new Array(def.size[1]);
            for (var j = 0; j < def.size[1]; j++) {
                map[i][j] = null;
            }
        }
    }

    function initializeUi (element) {
        canvas = element;

        // box
        box = document.createElement("div");
        box.className = "box " + ["exit-up", "exit-right", "exit-down", "exit-left"][def.exit];
        canvas.appendChild(box);
        
        // grid, cars, exit
        generateGrid();

        cars = [];
        def.cars.forEach(function(cardef, index){
            var el = generateCar(cardef, index); 
            box.appendChild(el);
            cars.push(el);
        });
        redcar = cars[0];
        redcar.className += " redcar";

        generateExit();                       

        // update box dimensions
        canvas.style.width = (def.size[1] + 1) * constants.gridsize + "px";
        canvas.style.height = (def.size[1] + 1) * constants.gridsize + "px";
        
        // update positions and scaling
        updateUi();
    }

    function generateExit() {
        var exit = document.createElement("div");
        exit.className = "exit";
        var cell = document.createElement("div");
        cell.className = "cell";
        exit.appendChild(cell);
        box.appendChild(exit);
        var grid = box.querySelector('.grid');
        var exitquery;
        switch (def.exit) {
            case 0:
                exitquery = "tr:first-child td:nth-child(" + (redcar.def.s + 1) + ")";
                exit.style.left = redcar.position.x * constants.gridsize - constants.gridspace + "px";
                exit.style.top = "0px";
                break;
            case 1:
                exitquery = "tr:nth-child(" + (redcar.def.s + 1) + ") td:last-child";
                exit.style.left = def.size[1] * constants.gridsize - constants.gridspace + "px";
                exit.style.top = redcar.def.s * constants.gridsize - constants.gridspace + "px";
                break;
            case 2:
                exitquery = "tr:last-child td:nth-child(" + (redcar.def.s + 1) + ")";
                exit.style.left = (redcar.def.s + 1) * constants.gridsize + "px";
                exit.style.top = def.size[0] * constants.gridsize - constants.gridspace + "px";
                break;
            case 3:
                exitquery = "tr:nth-child(" + (redcar.def.s + 1) + ") td:first-child";
                exit.style.right = 0 + "px";
                exit.style.top = redcar.def.s * constants.gridsize - constants.gridspace + "px";
                break;
        }
        grid.querySelector(exitquery).className += " exit";
    }

    // generates grid (table) and appends to box
    function generateGrid() {
        var grid = document.createElement("table");
        grid.className = "grid";
        for (var i = 0; i < def.size[0]; i++) {
            var tr = document.createElement("tr");
            for (var j = 0; j < def.size[1]; j++) {
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
    function generateCar(cardef, index) {
        var el = document.createElement('div');
        el.className += "car";
        el.def = cardef;
        el.position = cardef.p;
        el.maxpos = (cardef.o === 0 ? def.size[1] : def.size[0]);
        el.index = index;
        el.setAttribute('id', 'car' + index);

        if (index === 0) {
            el.exit = (def.exit == 1 || def.exit == 2) ? el.maxpos : -1;
        }

        el.car_position_px = 0;
        Object.defineProperty(el, "car_position", { 
            //get: cardef.o === 0 ? function(){ return el.offsetLeft; } : function(){ return el.offsetTop; },
            get: function(){ return el.car_position_px },
            set: cardef.o === 0 ? 
                function(value) { el.car_position_px = value; el.style.left = value + "px"; } :
                function(value) { el.car_position_px = value; el.style.top = value + "px"; } 
            });

        el.car_length = constants.gridsize * cardef.l - constants.gridspace;
        var length = el.car_length - constants.carborder + "px";
        var width = constants.gridsize - constants.gridspace - constants.carborder + "px";
        var street = constants.gridsize * cardef.s + "px";
        if (cardef.o === 0) {
            el.style.width = length;
            el.style.height = width;
            el.style.top = street;
        } else {
            el.style.width = width;
            el.style.height = length;
            el.style.left = street;
        }

        el.gesture = new MSGesture();
        el.gesture.target = el;
        el.addEventListener("MSGestureStart", gestureStart, false);
        el.addEventListener("MSGestureEnd", gestureEnd, false);
        el.addEventListener("MSGestureChange", gestureChange, false);
        el.addEventListener("MSPointerDown", pointerDown, false);
        return el;
    }
            
    function updateUi() {
        // compute coef and scale box
        cars.forEach(updateCarPosition);
    }

    function updateCarPosition(car) {
        car.car_position = car.position * constants.gridsize;
        updateMap(car, car.car_position);
    }

    function gestureStart(evt) {
        var car = evt.currentTarget;
        car.startX = evt.clientX - car.offsetLeft;
        car.startY = evt.clientY - car.offsetTop;
    }

    function gestureEnd(evt) {
        if (solved) return;
        var car = evt.currentTarget;
        var newpos = Math.round(car.car_position / constants.gridsize);
        if (newpos != car.position) {
            car.position = newpos;
            controller.action("posun vole");
        }
        var anim = WinJS.UI.Animation.createRepositionAnimation(car);
        updateCarPosition(car);
        anim.execute();
    }

    function getMap(orientation, street, position){
        return orientation === 0 ? map[street][position] : map[position][street];
    }

    function updateMapUnset(orientation, street, position, value){
        var x = orientation === 0 ? position : street, y = street + position - x;
        if (map[y][x] === value){
            map[y][x] = null;
        }
    }

    function updateMapSet(orientation, street, position, value){
        var x = orientation === 0 ? position : street, y = street + position - x;
        if (map[y][x] !== null && map[y][x] !== value) {
            console.log("Map overwriting!");
        }
        map[y][x] = value;
    }

    function updateMap(car, position){
        car.posL = Math.floor( position / constants.gridsize);
        car.posR = Math.floor( (position + car.car_length + constants.gridspace - 1) / constants.gridsize);
        var unset = updateMapUnset.bind(this, car.def.o, car.def.s);
        var set = updateMapSet.bind(this, car.def.o, car.def.s);
        var i;
        for (i = 0; i < car.posL; i++) unset(i, car.index);
        for (; i <= car.posR; i++) set(i, car.index);
        for (; i < car.maxpos; i++) unset(i, car.index);
        logMap();
    }

    function logMap(){
        console.log("");
        var s;
        for (var j = 0; j < def.size[0]; j++) {
            s = "";
            for (var i = 0; i < def.size[1]; i++) s+= map[j][i] == null ? "-" : map[j][i];
            console.log(s);
        }
    }

    // gesture change for horizontal cars
    function gestureChange(evt) {
        if (solved) return;
        var car = evt.currentTarget;
        var req = car.def.o == 0 ? (evt.clientX - car.startX) : (evt.clientY - car.startY);
        var posL = Math.floor( req / constants.gridsize);
        var posR = Math.floor( (req + car.car_length + constants.gridspace - 1) / constants.gridsize);
        var m = getMap.bind(this, car.def.o, car.def.s);
        if (car.posR < posR) {
            var test = car.posR + 1;
            while (test <= posR && test < car.maxpos && m(test) === null) test++;
            if (test <= posR){
                if (test == car.maxpos){
                    if (car.exit === car.maxpos) {
                        finished(car, req);
                        return;
                    } else {
                        req = car.maxpos * constants.gridsize - car.car_length - constants.gridspace;
                    }
                } else {   // m(test) !== null
                    req = test * constants.gridsize - car.car_length - constants.gridspace;
                }   
            }
        } else if (car.posL > posL) {
            var test = car.posL - 1;
            while (test >= posL && test >=0 && m(test) === null) test--;
            if (test >= posL){
                if (test === -1){
                    if (car.exit === -1) {
                        finished(car, req);
                        return;
                    } else { 
                        req = 0;
                    }
                } else { // m(test) !== null
                    req = (test + 1) * constants.gridsize;
                }   
            }
        } 

        if ((car.posL != posL || car.posR != posR) && req != car.car_position) {
            updateMap(car, req);
        }
        car.car_position = req;
    }

    function finished(car, pos) {
        solved = true;
        car.car_position = pos;
        controller.action("posun");
        controller.action_solved("jop");
    }

    function pointerDown (evt) {
        evt.currentTarget.gesture.addPointer(evt.pointerId);
    }

    function getState () {
        return cars.map(function(car) { return car.position });
    }

    function setState(state) {
        solved = false;
        cars.forEach(function (car, index){
            car.position = state[index];
            updateCarPosition(car);
        });
    }

    // PUBLIC FIELDS
    this.initializeUi = initializeUi;
    this.updateUi = updateUi;
    this.getState = getState;
    this.setState = setState;

    init();
};