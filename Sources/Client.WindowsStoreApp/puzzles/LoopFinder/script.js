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
    var lastclickTime, lastclickSegm;
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

        // generate grid
        var grid = generateGrid();
        document.body.addEventListener("MSPointerUp", pointerUpOutBody, false);

        updateUi();
    }

    function generateCell(type, left, up) {
        var el = document.createElement("td");
        el.celltype = type;
        el.className = type;
        el.neighbour = { left: null, right: null, up: null, down: null };
        if (type == "hsegment" || type == "vsegment") {
            var maybe = document.createElement("div");
            maybe.className = "maybe";
            el.appendChild(maybe);
            el.state = 0;
        } else if (type === "cell") {
            el.fullfilled = true;
            el.goal = null;
        }

        if (left !== null && left !== undefined) {
            el.neighbour.left = left;
            left.neighbour.right = el;
        }

        if (up !== null && up !== undefined) {
            el.neighbour.up = up;
            up.neighbour.down = el;
        }

        return el;
    }

    function generateRow(typeb, typee, typec, prev){
        var tr = document.createElement("tr");
        // border
        var border = tr.appendChild(generateCell(typeb, null, prev[0]));
        // first typea
        var cell = tr.appendChild(generateCell(typee, border, prev[1]));
        border.link = cell;
        for (var i = 0; i < size[1]; i++) {
            // typeb and typea
            cell = tr.appendChild(generateCell(typec, cell, prev[2*i+2]));
            cell = tr.appendChild(generateCell(typee, cell, prev[2*i+3]));
        }
        var border = tr.appendChild(generateCell(typeb, cell, prev[2*size[1]+2]));
        border.link = cell;
        return tr;
    }

    function generateGrid() {        
        var grid = document.createElement("table");
        var border = grid.appendChild(generateRow("bborder", "vhborder", "shborder", new Array(2*size[1]+3)));
        var tr = grid.appendChild(generateRow("vvborder", "vertex", "hsegment", border.childNodes));
        for (var i = 0; i < border.childNodes.length; i++){
           border.childNodes[i].link = tr.childNodes[i];
        }
        for (var i = 0; i < size[0]; i++) {
            tr = grid.appendChild(generateRow("svborder", "vsegment", "cell", tr.childNodes));
            for (var j = 0; j < size[1]; j++){
                if (def[i][j] !== ".") {
                    var k = parseInt(def[i][j]);
                    var el = tr.childNodes[j*2+2];
                    el.goal = k;
                    if (k === 0){
                        el.className += " fullfilled";
                    } else {
                        unfulfilled++;
                        el.fullfilled = false;
                    }
                    el.textContent = k;
                }
            }
            tr = grid.appendChild(generateRow("vvborder", "vertex", "hsegment", tr.childNodes));
        }
        border = grid.appendChild(generateRow("bborder", "vhborder", "shborder", tr.childNodes));
        for (var i = 0; i < border.childNodes.length; i++){
           border.childNodes[i].link = tr.childNodes[i];
        }
        
        grid.addEventListener("MSPointerDown", pointerDown, true);
        grid.addEventListener("MSPointerMove", pointerMove, true);
        grid.addEventListener("contextmenu", function(e){ e.preventDefault(); }, true);
        grid.className = "grid";
        return box.appendChild(grid);
    }
            
    function updateUi() {
        //
    }

    function changeState(segm, state){
        segm.prevstate = segm.state;
        if (segm.state === state) return;
        //console.log("change to "+ state);
        segm.state = state;
        if (segm.celltype == "hsegment") {
            updateCellState(segm.neighbour.up);
            updateCellState(segm.neighbour.down);
        } else {
            updateCellState(segm.neighbour.left);
            updateCellState(segm.neighbour.right);
        }

        if (unfulfilled == 0){
            checkSolved();
        }
        //
        var classNames = { "-1": "nofence", "0": "maybe", "1": "fence" };
        segm.firstChild.className = classNames[state];
    }

    function updateCellState(cell){
        if (cell === null || cell.celltype !== "cell" || cell.goal == null) return;
        var num = (cell.neighbour.left.state === 1 ? 1 : 0) +
                  (cell.neighbour.up.state === 1 ? 1 : 0) +
                  (cell.neighbour.right.state === 1 ? 1 : 0) +
                  (cell.neighbour.down.state == 1 ? 1 : 0);
        unfulfilled += (num == cell.goal ? -1 : 0) + (cell.fullfilled ? 1 : 0);
        cell.fullfilled = num == cell.goal;
        if (cell.fullfilled) {
            $(cell).addClass("fullfilled");
        } else {
            $(cell).removeClass("fullfilled");
        }
    }

    function checkSolved(){
        var fences = 0, first;
        // check all segments
        var all = document.querySelectorAll("td");
        for (var i = 0; i < all.length; i++){
            var el = all[i];
            if (el.celltype === "hsegment" || el.celltype === "vsegment") { 
                el.nextOnPath = [];
                if (el.state === 1) {
                    fences += 1;
                    first = el;
                }
            }
        }
        // check all vertices
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el.celltype !== "vertex") continue;
            var segments = [];
            if (el.neighbour.left.state === 1) segments.push(el.neighbour.left);
            if (el.neighbour.right.state === 1) segments.push(el.neighbour.right);
            if (el.neighbour.up.state === 1) segments.push(el.neighbour.up);
            if (el.neighbour.down.state === 1) segments.push(el.neighbour.down);
            if (segments.length == 0) continue;
            if (segments.length !== 2) return;
            segments[0].nextOnPath.push(segments[1]);
            segments[1].nextOnPath.push(segments[0]);
        }
        var prev = first;
        var segm = first.nextOnPath[0];
        var count = 1;
        while (segm !== first && count <= fences){
            var next = segm.nextOnPath[0] === prev ? segm.nextOnPath[1] : segm.nextOnPath[0];
            prev = segm;
            segm = next;
            count++;
        }
        
        if (count === fences){
            controller.action_solved();
        }
    }

    function pointerDown(evt){
        var el = evt.target.tagName === "TD" ? evt.target : evt.target.parentNode;
        var x = evt.offsetX, y = evt.offsetY;
        
        switch (el.celltype) {
            case "hsegment": case "vsegment":
                startSegment = el;
                break;
            case "cell": case "vertex": 
                var leftup = x <= (el.offsetWidth - y), leftdown = x < y;
                startSegment = leftup ? (leftdown ? el.neighbour.left : el.neighbour.up) : 
                                        (leftdown ? el.neighbour.down : el.neighbour.right)
                break;
            case "vvborder":
                startSegment = (y < el.offsetHeight/2) ? el.neighbour.up.link : el.neighbour.down.link;
                break;
            case "vhborder":
                startSegment = (x < el.offsetWidth/2) ? el.neighbour.left.link : el.neighbour.right.link;
                break;
            case "svborder": case "shborder":
                startSegment = el.link;
                break;
            default:
                return false;
        }

        if (startSegment.celltype == "hsegment" || startSegment.celltype == "vsegment"){
            emptyStack();
            mode = evt.which === 1 ? (startSegment.state === 0 ? 1 : 0) : -1;
            // check for double click
            var now = (new Date()).getTime();
            if (lastclickTime && now - lastclickTime < 500 && lastclickSegm === startSegment){
                mode = -1;
            }
            lastclickTime = now;
            lastclickSegm = startSegment;

            changeState(startSegment, mode);   
        }
        evt.stopPropagation();
    }

    // function pointerHold(evt){
    //     console.log("Segment: mouse hold - " + evt.which);
    //     console.log(mode);
    // }

    function emptyStack(){
        stack.forEach(function(vert){ vert.inpath = false; });
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
        if (stack.length <= 1 && (startSegment.neighbour.up === vert || startSegment.neighbour.left === vert || 
                                  startSegment.neighbour.down === vert || startSegment.neighbour.right === vert)) {
            stack[0].inpath = false;
            vert.inpath = true;
            stack = [vert];
            return;   
        }

        // verify connection
        var segm = vert === last.neighbour.up.neighbour.up ? last.neighbour.up :
                   vert === last.neighbour.down.neighbour.down ? last.neighbour.down : 
                   vert === last.neighbour.left.neighbour.left ? last.neighbour.left : 
                   vert === last.neighbour.right.neighbour.right ? last.neighbour.right : null;
        if (segm === null) return;
        if (vert.inpath == true){
            // delete path to vert
            while (stack.last() != vert){
                var a = stack.pop();
                var b = stack.last();
                a.inpath = false;
                changeState(a.segmPath, a.segmPath.prevstate);    
            }
        } else {
            // add vert to path
            changeState(segm, mode);
            vert.inpath = true;
            vert.segmPath = segm;
            stack.push(vert);
        }
    }

    function pointerMove(evt){
        if (mode == null) return;
        var el = evt.target.tagName === "TD" ? evt.target : evt.target.parentNode;
        if (el.tagName != "TD") return;
        // find vertex            
        var vert = null;
        switch (el.celltype) {
            case "vertex":
                vert = el;
                break;
            case "vvborder": case "vhborder": 
                vert = el.link;
                break;
            case "hsegment":
                vert = evt.offsetX > el.offsetWidth/2 ? el.neighbour.right : el.neighbour.left;
                break;
            case "vsegment":
                vert = evt.offsetY > el.offsetHeight/2 ? el.neighbour.down : el.neighbour.up;
                break;
            case "cell":
                vert = el;
                vert = evt.offsetX < el.offsetWidth / 2 ? vert.neighbour.left : vert.neighbour.right;
                vert = evt.offsetY < el.offsetHeight / 2 ? vert.neighbour.up : vert.neighbour.down;
                break;
            case "shborder":
                vert = evt.offsetX > el.offsetWidth/2 ? el.link.neighbour.right : el.link.neighbour.left;
                break;
            case "svborder":
                vert = evt.offsetY > el.offsetHeight/2 ? el.link.neighbour.down : el.link.neighbour.up;
                break;
        }

        if (vert !== null && vert.celltype === "vertex") {
            addVertexToPath(vert);
        }
    }

    function pointerUpOutBody(evt){
        if (mode === null) return;
        mode = null;
        controller.action(getState());
    }

    function getState() {
        var state = "";
        var all = document.querySelectorAll("td");
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el.celltype === "hsegment" || el.celltype === "vsegment") {
                state += ["x"," ","-"][el.state + 1];
            }
        }
        return { segm: state };
    }

    function setState (state) {
        var all = document.querySelectorAll("td");
        var j = 0;
        var encode = {"x": -1, " ": 0, "-" : 1};
        for (var i = 0; i < all.length; i++) {
            if (all[i].celltype !== "hsegment" && all[i].celltype !== "vsegment") continue;
            changeState(all[i], state.segm === null ? 0 : encode[state.segm[j]]);
            j++;
        }
    }

    // PUBLIC FIELDS
    this.initializeUi = initializeUi;
    this.updateUi = updateUi;
    this.getState = getState;
    this.setState = setState;

    init();
};