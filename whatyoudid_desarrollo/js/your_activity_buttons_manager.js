

d3.select("#macButton")
    .on("click", function() {
        var mac = document.getElementById("macInput").value
        mac=mac.toUpperCase();
        paintMacActivity(mac);
});
d3.select("#randomMac")
    .on("click", function() {
        paintAleatoryMac(jsonCirclesMap[Math.floor(Math.max(Math.random()*7, 1))].nameId);
<<<<<<< HEAD
});
=======
    
    
  //  var link="mailto:lcalvo@bsc.es&subject=camiseta_sonar&body=kkk";    
  //      window.location.href = link;
    
    
});


/*d3.select("#tshirtButton")
    .on("click", function() {
    console.log("here");
        var mail = document.getElementById("tshirtInput").value;

       console.log(mail); 
    
    send_mail(mail);
});


function send_mail(mail_in){
        var link="mailto:lcalvofl@gmail.com&subject=camiseta_sonar&body="+mail_in;
    
        window.location.href = link;
    
        alert("Your request has been sent.");
                     /*d3.select("#errorMessageMAIL").style("visibility", "visible");*/
    
/*}*/
>>>>>>> 89c161c36bf54f750f2e9b612e41774c5d15c05a
