var SPRITE_W = 9;
var SPRITE_H = 5;
var SPRITE_FRONT = 0;
var SPRITE_LEFT = 1;
var SPRITE_RIGHT = 2;
var SPRITE_BACK = 3;

var player;
var playerFrame = 0;
var playerDir = SPRITE_FRONT;
function parsePlayer(playerString){
    var player = [
        ["","","",""],
        ["","","",""],
        ["","","",""],
        ["","","",""]
    ];
    // 4 directions: front, left, right, back
    var rows = playerString.split("\n");
    for(var row_i=0; row_i < rows.length; row_i++){
        var row = rows[row_i];
        for(var col_i=0; col_i < row.length; col_i++){
            player[Math.floor(row_i/SPRITE_H)][Math.floor(col_i/SPRITE_W)] += row[col_i];
        }
        for(var i=0;i<3;i++){
            player[Math.floor(row_i/SPRITE_H)][i] += "\n";
        }
    }
        for(var i=0;i<4;i++){
            player[i][3] = player[i][1];
        }
    return player;
}

// http://stackoverflow.com/a/21574562/4187005
function fillTextMultiLine(ctx, text, x, y) {
  var lineHeight = ctx.measureText("M").width * 2;
  var lines = text.split("\n");
  for (var i = 0; i < lines.length; ++i) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
}

// layers str2 over str1
function layerText(str1, str2, x, y){
    var out = "";
    var lines1 = str1.split("\n");
    var lines2 = str2.split("\n");
    for(var i=0;i<lines1.length;i++){
        for(var j=0;j<lines1[i].length;j++){
            if( i-y > 0 && j-x > 0 &&
                i-y < lines2.length && j-x < lines2[i-y].length && 
                lines2[i-y][j-x] != " "){
                out += lines2[i-y][j-x];
            }else{
                out += lines1[i][j];
            }
        }
        out += "\n";
    }
    return out;
}

    var buf = "";
    var title = "";
    var comingSoon = "";
    var box = "";
    var show = function(){
        var canvas = document.getElementById("main");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "black"; 
        ctx.fillRect(0,0,800,600);
        
        ctx.font = "bold 16.6px Courier New";
        ctx.fillStyle = "blue";
        ctx.textAlign = "left";
        fillTextMultiLine(ctx, buf, 0,15);
    }
    var frameNum = 0;
    function render(){
        if(frameNum % 60 < 30)
                buf = layerText(box, comingSoon, 0, 0);
        else{
                buf =  layerText( box, title, 0,0);
        }
                buf = layerText(buf, player[playerDir][playerFrame], 35, 22);
                
                playerFrame = Math.floor((frameNum % 30)/7.5);
                playerDir = Math.floor((frameNum % 120)/30);
                
                show();
                frameNum +=  1;
                setTimeout(render, 1000/30); //30 fps
    }
    $.get('html/tpls/box.txt', function(response){
        box=response;
        $.get('html/tpls/startup/title.txt', function(response){
            title=response;
            $.get('html/tpls/startup/comingSoon.txt', function(response){
                comingSoon=response;
                render();
            });
        });
    });
    
    $.get('html/tpls/game/player.txt', function(response){
        player = parsePlayer(response);
    });