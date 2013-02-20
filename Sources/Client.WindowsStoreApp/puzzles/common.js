Array.prototype.last = function() {
	return this[this.length-1];
}

function histogram(paper, x, y, width, height, values, emph) {
    var emphColor = "#f57900";
    var normalColor = "#3465a4";
    var barwidth = Math.floor(width / values.length);
    var innerbarwidth = Math.floor(barwidth * 0.9);
    var maxvalue = Math.max.apply(Math, values);

    values.forEach(function (value, index) {
        var barheight = Math.floor(height * (value / maxvalue));
        paper.rect(x + barwidth * index, y + height - barheight, innerbarwidth, barheight).attr("fill", emph == index ? emphColor : normalColor);
    });
}

function timehistogram(element, length, values, actualTime) {
    var r = Raphael(element);
    var height = element.offsetHeight - 20;
    var width = element.offsetWidth - 10;
    var emph = Math.floor((actualTime - 1) / length);
    if (emph < values.length) values[emph]++;
    histogram(r, 10, 0, width, height, values, emph);

    function label(seconds, text) {
        r.text(Math.floor(10 + width * seconds / (length * values.length)), height + 10, text);
    }

    var s1 = 10 * Math.floor(length * values.length / 30);
    var s2 = 10 * Math.floor(length * values.length * 2 / 30);
    label(0, "0s");
    label(s1, s1 + "s");
    label(s2, s2 + "s");
}

function formatTime(time) {
    var seconds = Math.floor(time / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
