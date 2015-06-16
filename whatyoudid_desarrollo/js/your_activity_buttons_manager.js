

d3.select("#macButton")
    .on("click", function() {
        var mac = document.getElementById("macInput").value
        paintMacActivity(mac);
});
d3.select("#randomMac")
    .on("click", function() {
        paintAleatoryMac(jsonCirclesMap[Math.floor(Math.max(Math.random()*7, 1))].nameId);
});