
var MoveAction = function (params) {
    this.timestamp = Date.now();
    this.type = "Move";
    this.parametres = params;
}

var Action = function (type) {
    this.timestamp = Date.now();
    this.type = type;
    this.parametres = null;
}

// returns the response and a returned object, if any
var SendHttpRequest = function (verb, url, postdata) {

}

var Client = function (url) {
    this.url = url;
}

Client.prototype.GetPuzzles = function (type, skip, top) {
    url = this.url + "/puzzles?";
    if (type != null) url += "type="+type+"&";
    if (skip != null) url += "skip="+skip+"&";
    if (top != null) url += "top="+top;
    response = SendHttpRequest("GET", url, "");
    if (response.code != 200)
        return false;
    else
        return response.data;
}

Client.prototype.GetPuzzle = function (id) {
    url = this.url + "/puzzle?id="+id;
    response = SendHttpRequest("GET", url, "");
    if (response.code != 200)
        return false;
    else
        return response.data;
}

client = new Client("http://127.0.0.1/");


var Controller = function (puzzleId) {
    this.puzzleId = puzzleId;
    this.actionLog = new Array();
    // get puzzle def from API
    // make appropriate puzzle object
    this.puzzle = new Puzzle(this);
    this.puzzle.PutHTML(container);
    this.actionLog.push(new Action("Open"));
};

Controller.prototype.LogAction = function (params) {
    this.actionLog.push(new MoveAction(params));
};

Controller.prototype.Pause = function (params) {
    this.actionLog.push(new Action("Pause"));
    // Aby nic nebylo vidět
}

Controller.prototype.Continue = function (params) {
    this.actionLog.push(new Action("Continue"));
    this.puzzle.PutHTML(container)
}

Controller.prototype.Solved = function (action) {
    this.actionLog.push(new Action("Solved"));
    this.sendData();
}

Controller.prototype.Close = function (action) {
    this.actionLog.push(new Action("Solved"));
    this.sendData();
}

Controller.prototype.sendData = function () {
    log = { userId: "John", puzzleId: this.puzzleId, actions: this.actionLog };
    // sent log, on call back clean actionLog
}



var Puzzle = function (controller) {
    this.controller = controller;
}

Puzzle.prototype.PutHTML = function (container) {

}

Puzzle.prototype.SetState = function (state) {

}

Puzzle.prototype.GetState = function () {

}

Puzzle.prototype.UndoAction = function (action) {

}

Puzzle.prototype.RedoAction = function (action) {

}
