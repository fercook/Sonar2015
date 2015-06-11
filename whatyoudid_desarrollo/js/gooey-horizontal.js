$(function($) {
            $("#gooey-upper").gooeymenu({
                bgColor: "#ff6666",
                contentColor: "white",
                style: "circle",
                horizontal: {
                    menuItemPosition: "glue"
                },
                vertical: {
                    menuItemPosition: "spaced",
                    direction: "up"
                },
                circle: {
                    radius: 80
                },
                margin: "small",
                size: 90,
                bounce: true,
                bounceLength: "small",
                transitionStep: 100,
                hover: "#e55b5b"
            });
$("#gooey-h").gooeymenu({
                bgColor: "#e91e63",
                contentColor: "white",
                style: "horizontal",
                horizontal: {
                    menuItemPosition: "spaced"
                },
                vertical: {
                    menuItemPosition: "spaced",
                    direction: "up"
                },
                circle: {
                    radius: 70
                },
                margin: "small",
                size: 70,
                bounce: true,
                bounceLength: "small",
                transitionStep: 100,
                hover: "#a91748"
               
            });
$("#gooey-round").gooeymenu({
                bgColor: "#68d099",
                contentColor: "white",
                style: "circle",
                horizontal: {
                    menuItemPosition: "spaced"
                },
                vertical: {
                    menuItemPosition: "spaced",
                    direction: "up"
                },
                circle: {
                    radius: 85
                },
                margin: "small",
                size: 80,
                bounce: true,
                bounceLength: "small",
                transitionStep: 100,
                hover: "#5dbb89"
            });
   $("#gooey-API").gooeymenu({
                bgColor: "#68d099",
                contentColor: "white",
                style: "circle",
                circle: {
                    radius: 85
                },
                margin: "small",
                size: 70,
                bounce: true,
                bounceLength: "small",
                transitionStep: 100,
                hover: "#5dbb89",
                open: function() {
                    $(this).find(".gooey-menu-item").css("background-color", "steelblue");
                    $(this).find(".open-button").css("background-color", "steelblue");
                },
                close: function() {
                    $(this).find(".gooey-menu-item").css("background-color", "#ffdf00");
                    $(this).find(".open-button").css("background-color", "#ffdf00");
                }
            });
 $("#gooey-v").gooeymenu({
                bgColor: "#68d099",
                contentColor: "white",
                style: "vertical",
                horizontal: {
                    menuItemPosition: "glue"
                },
                vertical: {
                    menuItemPosition: "spaced",
                    direction: "up"
                },
                circle: {
                    radius: 90
                },
                margin: "small",
                size: 70,
                bounce: true,
                bounceLength: "small",
                transitionStep: 100,
                hover: "#68d099"
            });

        });

$(function($) {
         $(".fa-angle-double-up").on("click",function(event){
             var body = $("html, body");
             body.animate({scrollTop:0}, '500', 'swing', function() { 
         });
     });
     window.location.hash="";
     window.onhashchange=function() {
         if (document.location.hash === "#docs") {
             $("#docs").css("display","block");
             $("#page1").css("display","none");
         }
         else if (document.location.hash !== "#docs" ) {
             $("#docs").css("display", "none");
             $("#page1").css("display","block");
             document.location.hash=window.location.hash;
         }
     };
     
     
     });
