"use strict";

function Puzzle(puzzle, controller) {
    // PRIVATE FIELDS
    var def, istate;
    var size, boxes, man, move = false, grid;
    var remaining;
    var solved = false;

    // html elements
    var canvas, wrapper; 
    var constants = {
        gridsize: 100,
    };

    
    function init() {
        def = puzzle.def;
        istate = puzzle.istate;
        size = [def.length, def[0].length];
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
        remaining = istate.boxes.length;
        istate.boxes.forEach(function(box){
            var el = document.createElement("div");
            el.className = "box";
            el.addEventListener("MSPointerMove", pointerMove, true);
            wrapper.appendChild(el);
            boxes.push(el);
        })

        man = document.createElement("div");
        man.className = "man";
        wrapper.appendChild(man);
        man.addEventListener("MSPointerDown", pointerDown, false);

        document.body.addEventListener("MSPointerUp", pointerUpOutBody, false);
        document.addEventListener("keydown", keyDown, false);

        setState(istate);
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
                switch (def[i][j]){
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
            if (def[box.mapy][box.mapx] == '.') {
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
        move = true;
    }

    function pointerMove(evt){
        if (!move) return;
        moveMan(evt.target.mapy, evt.target.mapx);
    }

    function pointerUpOutBody(evt){
        move = false;
    }

    function moveBox(box, y, x, animate) {
        if (box.mapy === y && box.mapx === x) return;
        // move out of previous location
        if (box.mapy !== undefined) {
            if (def[box.mapy][box.mapx] === '.') {
                $(box).removeClass("boxonpost");
                remaining++;
            }

            grid[box.mapy][box.mapx].box = null;
        }
        // move in the new one
        grid[y][x].box = box;
        box.mapx = x;
        box.mapy = y;
        if (def[y][x] === '.') {
            $(box).addClass("boxonpost");
            remaining--;
        }
        // transition
        if (animate) {
            box.moving = true;
            $(box).animate({ top: box.mapy*constants.gridsize + "px", left: box.mapx*constants.gridsize + "px"}, 100, 'linear', function(){
                box.moving = false;
            });

            if (remaining === 0) {
                controller.action_solved();
            }
        } else {
            box.style.top = box.mapy*constants.gridsize;
            box.style.left = box.mapx*constants.gridsize;    
        }
    }

    function moveMan(y, x) {
        var action = false;
        var dx = - man.mapx + x, dy = - man.mapy + y;
        if (Math.abs(dx) + Math.abs(dy) !== 1) return;
        if (def[y][x] === "#") return;
        if (grid[y][x].box !== null) {
            if (def[y+dy][x+dx] === "#" || grid[y+dy][x+dx].box !== null) return;
            if (grid[y][x].box.moving == true) return;
            moveBox(grid[y][x].box, y + dy, x + dx, true);
            action = true;
        }
        man.mapx = x;
        man.mapy = y;
        $(man).animate({ top: man.mapy * constants.gridsize + "px", left: man.mapx * constants.gridsize + "px" }, 100, 'linear');
        if (action) {
            controller.action(null);
        }
    }

    function getState () {
        return {
            boxes: boxes.map(function(box){ return [box.mapy, box.mapx]; }),
            man: [man.mapy, man.mapx]
        };
    }

    function setState(state) {
        state.boxes.forEach(function(pos, index){
            moveBox(boxes[index], pos[0], pos[1], false);
        })

        man.mapx = state.man[1];
        man.mapy = state.man[0];
        updateUi();
    }

    // PUBLIC FIELDS
    this.initializeUi = initializeUi;
    this.updateUi = updateUi;
    this.getState = getState;
    this.setState = setState;

    init();
};