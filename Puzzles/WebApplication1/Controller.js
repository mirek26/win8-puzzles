
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
