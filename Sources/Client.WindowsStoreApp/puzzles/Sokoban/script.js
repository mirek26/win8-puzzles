"use strict";

function Puzzle(puzzle, controller) {
    // PRIVATE FIELDS
    var def, size, boxes, man, move = false, grid;
    var remaining;

    // html elements
    var canvas, wrapper; 
    var constants = {
        gridsize: 100,
    };

    // helper structures
    var solved = false;
    
    function init() {
        def = puzzle.def;
        size = [def.map.length, def.map[0].length];
    }

    function initializeUi (element) {
        canvas = element;

        // wrapper
        wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        canvas.appendChild(wrapper);

        // generate grid
        generateGrid();
        boxes = [];
        remaining = def.boxes.length;
        def.boxes.forEach(function(box){
            var el = document.createElement("div");
            el.className = "box";
            el.mapx = box[1];
            el.mapy = box[0];
            grid[el.mapy][el.mapx].box = el;
            el.addEventListener("MSPointerMove", pointerMove, true);
            wrapper.appendChild(el);
            boxes.push(el);
        })

        man = document.createElement("div");
        man.className = "man";
        man.mapx = def.position[1];
        man.mapy = def.position[0];
        wrapper.appendChild(man);
        man.addEventListener("MSPointerDown", pointerDown, false);

        document.body.addEventListener("MSPointerUp", pointerUpOutBody, false);
        document.addEventListener("keydown", keyDown, false);

        // update positions and scaling
        updateUi();
    }

    function generateGrid() {        
        grid = [];
        var table = document.createElement("table");
        for (var i = 0; i < size[0]; i++) {
            grid.push([]);
            var tr = document.createElement("tr");
            table.appendChild(tr);
            for (var j = 0; j < size[1]; j++) {
                var td = document.createElement("td");
                td.mapx = j; 
                td.mapy = i;
                td.box = null;
                switch (def.map[i][j]){
                    case "#":
                        td.className = "wall";
                        break;
                    case " ":
                        td.className = "empty";
                        break;
                    case ".":
                        td.className = "post";
                        break;
                }
                tr.appendChild(td);
                grid[i].push(td);
            }
        }
        
        table.addEventListener("MSPointerMove", pointerMove, true);
        table.className = "grid";
        return wrapper.appendChild(table);
    }
            
    function updateUi() {
        remaining = boxes.length;
        boxes.forEach(function(box){
            box.style.top = box.mapy*constants.gridsize + "px";
            box.style.left = box.mapx*constants.gridsize + "px";
            if (def.map[box.mapy][box.mapx] == '.') {
                $(box).addClass("boxonpost");
                remaining--;
            } else {
                $(box).removeClass("boxonpost");
            }
        });
        
        man.style.top = man.mapy * constants.gridsize + "px";
        man.style.left = man.mapx * constants.gridsize + "px";
    }

    function keyDown(evt){
        switch (evt.key){
            case "Up": 
                moveMan(man.mapy - 1, man.mapx);
                break;
            case "Down":
                moveMan(man.mapy + 1, man.mapx);
                break;
            case "Left":
                moveMan(man.mapy, man.mapx - 1);
                break;
            case "Right":
                moveMan(man.mapy, man.mapx + 1);
                break;
            default:
                return;
        }
        evt.preventDefault();
    }


    function pointerDown(evt){
        console.log("down");
        move = true;
    }

    function pointerMove(evt){
        if (!move) return;
        console.log(evt.clientY);
        moveMan(evt.target.mapy, evt.target.mapx);
    }

    function pointerUpOutBody(evt){
        console.log("up");
        move = false;
    }

    function moveBox(box, y, x) {
        if (def.map[box.mapy][box.mapx] === '.'){
            $(box).removeClass("boxonpost");    
            remaining++;
        }

        grid[box.mapy][box.mapx].box = null;
        grid[y][x].box = box;
        box.mapx = x;
        box.mapy = y;
        if (def.map[y][x] === '.') {
            $(box).addClass("boxonpost");
            remaining--;
        }

        box.moving = true;
        $(box).animate({ top: box.mapy*constants.gridsize + "px", left: box.mapx*constants.gridsize + "px"}, 100, 'linear', function(){
            box.moving = false;
        });                
        if (remaining === 0) {
            controller.action_solved();
        }
        //box.style.top = box.mapy*constants.gridsize;
        //box.style.left = box.mapx*constants.gridsize;
    }

    function moveMan(y, x) {
        var dx = - man.mapx + x, dy = - man.mapy + y;
        if (Math.abs(dx) + Math.abs(dy) !== 1) return;
        if (def.map[y][x] === "#") return;
        if (grid[y][x].box !== null) {
            if (def.map[y+dy][x+dx] === "#" || grid[y+dy][x+dx].box !== null) return;
            if (grid[y][x].box.moving == true) return;
            moveBox(grid[y][x].box, y+dy, x+dx);
        }
        man.mapx = x;
        man.mapy = y;
        $(man).animate({ top: man.mapy*constants.gridsize + "px", left: man.mapx*constants.gridsize + "px"}, 100, 'linear');
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