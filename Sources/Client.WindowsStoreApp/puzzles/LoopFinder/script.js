"use strict";

function Puzzle(puzzle, controller) {
    // PRIVATE FIELDS
    var def, size;
    var stateH, stateV;

    // html elements
    var canvas, box; 
    var constants = {
        gridsize: 100,
    };

    // helper structures
    var map;
    var mode = null, startSegment = null, stack = [];
    var unfulfilled  = 0;
    var solved = false;
    
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
        for (var i = 0; i < 2*size[0]+1; i++){
            for (var j = 0; j < 2*size[1]+1; j++){
                var el = map[i][j];
                el.mapy = i;
                el.mapx = j;
                if (el.celltype === "cell")
                    el.fullfilled = true;
                    el.goal = null;
                    if (def[(i-1)/2][(j-1)/2] !== "."){
                        var k = (int)def[(i-1)/2][(j-1)/2];
                        el.goal = k;
                        if (k != 0){
                            unfulfilled++;
                            el.fullfilled = false;
                        } 
                        el.textContent = k;
                    }
                } else if (el.celltype === "hsegment" || el.celltype === "vsegment"){
                    el.state = 0;
                }
            }
        }

        document.body.addEventListener("MSPointerUp", pointerUpOutBody, false);

        // update canvas dimensions
        canvas.style.width = (size[1]+1) * constants.gridsize + "px";
        canvas.style.height = (size[0]+1) * constants.gridsize + "px";
        
        // update positions and scaling
        updateUi();
    }

    // generates grid (table) and appends to box
    function generateGrid() {
        function element(name, celltype){
            var el = document.createElement(name);
            el.celltype = celltype;
            el.className = celltyp;
            return el;
        }

        var vertex = element.bind(this, "td", "vertex");
        var cell = element.bind(this, "td", "cell");
        
        function segment(type){ 
            var el = element("td", type);
            el.appendChild(element("div", "maybe"));
            el.state = 0;
            return el;
        }
        
        function alternate(name, a, b, length, callback){
            var el = document.createElement(name); 
            callback(el.appendChild(a()));
            for (var i = 0; i < length; i++) {
                callback(el.appendChild(b()));
                callback(el.appendChild(a()));
            }
            return el;
        }

        // helper to add elements to map
        var appendToLastRow = function(el) { map[map.length-1].push(el); }
        var addRowToMap = function() { map.push([]); }
        // generates "segment row": vertex - hsegment - vertex ... - vertex
        var segments = alternate.bind(this, "tr", vertex, segment.bind(this, "hsegment"), size[1], appendToLastRow);
        // generates "cell row": vsegment, 
        var cells = alternate.bind(this, "tr", segment.bind(this, "vsegment"), cell, size[1], appendToLastRow);


        map = [[]];
        var grid = alternate("table", segments, cells, size[0], addRowToMap);
        map.pop();
        grid.addEventListener("MSPointerDown", pointerDown, true);
        grid.addEventListener("MSPointerMove", pointerMove, true);
        grid.className = "grid";
        return box.appendChild(grid);
    }
            
    function updateUi() {
        //
    }

    function startPathInSegment(y, x, button){
        emptyStack();
        if (x < 0 || y < 0 || y > size[0]*2 || x > size[1]*2) {
            mode = null;
            startSegment = null;    
            return;
        }

        startSegment = map[y][x];
        mode = button === 1 ? (startSegment.state === 0 ? 1 : 0) : -1;
        changeState(startSegment, mode);
        //
        console.log("starting in segment " + y + " " + x + ", mode " + mode);
    }

    function changeState(segm, state){
        segm.prevstate = segm.state;
        if (segm.state === state) return;
        //console.log("change to "+ state);
        segm.state = state;
        var classNames = { "-1": "nofence", "0": "maybe", "1": "fence" };
        $(segm.firstChild).removeClass("nofence").removeClass("maybe").removeClass("fence").addClass(classNames[state]);
    }

    function updateCellState(cell){
        if (cell.goal == null) return;
        var x = cell.mapx, y = cell.mapy;
        var num = (map[y][x-1].state == 1 ? 1 : 0) +
                  (map[y][x+1].state == 1 ? 1 : 0) +
                  (map[y-1][x].state == 1 ? 1 : 0) +
                  (map[y+1][x].state == 1 ? 1 : 0);
        unfulfilled += (num == cell.goal ? -1 : 0) + (cell.fullfilled ? 1 : 0);
        cell.fullfilled = num == cell.goal;
        if (unfulfilled == 0){
            testSolved();
        }
    }

    function testSolved(){
        var fences = 0, first;
        for (var i = 0; i < 2*size[0]+1; i++){
            for (var j = 0; j < 2*size[1]+1; j++){
                if (map[i][j].celltype == "hsegment" || map[i][j].celltype == "vsegment"){
                    fences += (map[i][j].state == 1 ? 1 : 0);
                    first = map[i][j];
                }
            }
        }

        first = map[i][j];
        var dx, dy;
        while ()

        
    }

    function pointerDown(evt){
        console.log("click on "+ evt.offsetX + " " + evt.offsetY);
        var el = evt.target, x = evt.offsetX, y = evt.offsetY;
        if (el.tagName != "TD") {
            el = el.parentNode; 
        }
        if (el.className == "hsegment" || el.className == "vsegment") {
            startPathInSegment(el.mapy, el.mapx, evt.which);
        } else {
            var leftup = x <= (el.offsetWidth - y), leftdown = x < y;
            console.log(leftup +" "+ leftdown)
            var dx = ((leftup ? -1 : 1) + (leftdown ? -1 : 1)) / 2;
            var dy = ((leftup ? -1 : 1) + (leftdown ? 1 : -1)) / 2;
            startPathInSegment(el.mapy + dy, el.mapx + dx, evt.which);
        }
        evt.stopPropagation()
    }

    // function pointerHold(evt){
    //     console.log("Segment: mouse hold - " + evt.which);
    //     console.log(mode);
    // }

    function emptyStack(){
        stack.forEach(function(vert){
            map[vert.mapy][vert.mapx].inpath = false;
        });
        stack = [];
    }

    function addVertexToPath(vert){
        if (stack.length == 0){
            vert.inpath = true;
            stack.push(vert);
            return;
        }
        var last = stack.last();
        if (vert === last) return;

        // handle first vertex
        if (stack.length <= 1 && (Math.abs(vert.mapx - startSegment.mapx) + Math.abs(vert.mapy - startSegment.mapy) == 1)){
            stack[0].inpath = false;
            vert.inpath = true;
            stack = [vert];
            return;   
        }

        // verify connection
        var dx = Math.abs(vert.mapx - last.mapx), dy = Math.abs(vert.mapy - last.mapy);
        if (!((dx == 0 && dy == 2) || (dx == 2 && dy == 0))) return;

        if (vert.inpath == true){
            // delete path to vert
            while (stack.last() != vert){
                var a = stack.pop();
                var b = stack.last();
                a.inpath = false;
                var segm = map[(a.mapy + b.mapy)/2][(a.mapx + b.mapx)/2];
                changeState(segm, segm.prevstate);    
            }
        } else {
            // add vert to path
            var segm = map[(last.mapy + vert.mapy)/2][(last.mapx + vert.mapx)/2];
            changeState(segm, mode);
            vert.inpath = true;
            stack.push(vert);
        }
    }

    function pointerMove(evt){
        if (mode == null) return;
        var el = evt.target;
        var vert;
        if (el.tagName != "TD"){
            el = el.parentNode;
        }
        if (el.tagName != "TD") return;
        // find vertex            
        if (el.className == "vertex"){
            vert = el;
        } else {
            if (el.className == "hsegment"){
                vert = map[el.mapy][el.mapx + (evt.offsetX > el.offsetWidth/2 ? 1 : -1)];
            } else if (el.className == "vsegment") {
                vert = map[el.mapy + (evt.offsetY > el.offsetHeight/2 ? 1 : -1)][el.mapx];
            } else if (el.className == "cell") {
                var left = evt.offsetX < el.offsetWidth / 2, up = evt.offsetY < el.offsetHeight / 2;
                vert = map[el.mapy + (up ? -1 : 1)][el.mapx + (left ? -1 : 1)];
            }
            console.log("vert: "+ vert.mapy + " " + vert.mapx);
            addVertexToPath(vert);
        };
    }

    function pointerUpOutBody(evt){
        //console.log("Body: mouse up or out");
        mode = null;
        console.log(mode);
    }

    function getState () {
    }

    function setState (state) {
    }

    // PUBLIC FIELDS
    this.initializeUi = initializeUi;
    this.updateUi = updateUi;
    this.getState = getState;
    this.setState = setState;

    init();
};