"use strict";

function Puzzle(puzzle, controller) {
    // PRIVATE FIELDS
    var def, size;
    var stateH, stateV;

    // html elements
    var canvas, box; 
    var constants = {
        gridsize: 100,
        segmentwidth: 18,
    };

    // helper structures
    var mode = "", solved = false;
    
    function init() {
        def = puzzle.def;
        size = [def.length, def[0].length];
    }

    function initializeUi (element) {
        canvas = element;

        // box
        box = document.createElement("div");
        box.className = "box";
        canvas.appendChild(box);
      
        var grid = generateGrid();
        for (var i = 0; i < size[0]; i++){
            for (var j = 0; j < size[1]; j++){
                if (def[i][j] !== "."){
                    var query = "tr:nth-child("+(2*i+2)+") td:nth-child("+(2*j+2)+")";
                    var cell = grid.querySelector(query);
                    cell.textContent = def[i][j];
                }
            }
        }

        document.body.onmousedown = mousedown;
        document.body.onmouseup = mouseup;

        // update canvas dimensions
        canvas.style.width = (size[1]+2) * constants.gridsize + "px";
        canvas.style.height = (size[0]+2) * constants.gridsize + "px";
        
        // update positions and scaling
        updateUi();
    }

    // generates grid (table) and appends to box
    function generateGrid() {
        function element(name, className){
            var el = document.createElement(name);
            el.className = className;
            return el;
        }

        var vertex = element.bind(this, "td", "vertex");
        var cell = element.bind(this, "td", "cell");
        function segment(type){ 
            var el = element("td", type);
            el.appendChild(element("div", "maybe"));
            var touch = element("div", "touch")
            touch.addEventListener("MSPointerOver", segmentmouseover, true);
            el.appendChild(touch);
            return el;
        }
        function alternate(name, a, b, length){
            var el = document.createElement(name); 
            el.appendChild(a());
            for (var i = 0; i < length; i++) {
                el.appendChild(b());
                el.appendChild(a());
            }
            return el;
        }
        var segments = alternate.bind(this, "tr", vertex, segment.bind(this, "hsegment"), size[1]);
        var cells = alternate.bind(this, "tr", segment.bind(this, "vsegment"), cell, size[1]);

        var grid = alternate("table", segments, cells, size[0]);
        grid.className = "grid";
        return box.appendChild(grid);
    }
            
    function updateUi() {
        //
    }

    function changeState(segm, state){
        if (segm.state === state) return;
        segm.state = state;
        if (state === 0){
            segm.className = segm.className.replace(/\b on\b/,'');
        } else {    
            segm.className += " on";
        }
    }

    function mousedown(evt) {
        if (mode !== "") return;
        mode = "?";
        console.log(mode);
    }

    function mouseup(evt) {
        mode = "";
        console.log(mode);
    }

    function segmentmousedown (evt) {
        if (mode !== "") return;
        var segm = evt.currentTarget;
        if (segm.state == 1){
            mode = "-";
            changeState(segm, 0);
        } else {
            mode = "+";
            changeState(segm, 1);
        }
        console.log(mode);
    }

    function segmentmouseover (evt) {
        if (mode === "") return;
        var segm = evt.currentTarget;
        if (mode === "?") {
            if (segm.state == 1){
                mode = "-";
                changeState(segm, 0);
            } else {
                mode = "+";
                changeState(segm, 1);
            }       
        } else if (mode === "+") {
            changeState(segm, 1);
        } else if (mode === "-") {
            changeState(segm, 0);
        }
    }

    function getState () {
        return cars.map(function(car) { return car.position });
    }

    function setState (state) {
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