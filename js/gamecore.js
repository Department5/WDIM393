var game = {
   state: "ready",
};

var overlay = {
    counter: -1,
    title: "foo",
    subtitle: "bar",
};

var player = {
	x:375,
	y:550,
	width: 25,
	height: 25,
	counter: 0,
};

var canvas = {
	width: 800,
	height: 600,
};

var stars = {
	
	counter: -1,
	x: 0,
	y: 0,
	width: 800,
	height: 600,
	src: "images/game/stars.png",
};

var keyboard = { };

var playerBullets = [];
var enemies = [];
var enemyBullets = [];
var score = 0;
var kills = 0;
level = 1;
var enemyCount = 10;

// =========== game   ============

function reset() {
	score = 0;
	keepScore();
	kills = 0;
	keepKills();
	level = 1;
	keepLevel();
	enemyCount = 10;
	playerBulletW = 20;
	playerBulletH = 20;
}

$('#play').click(function() {
	game.state = 'start';
	player.state = "alive";
	overlay.counter = -1;
});

function keepScore() {
	$('#score').text(score);  /* Update the score */ 
}

function keepKills() {
	$('#kills').text(kills);  /* Update the kills */ 
}

function keepLevel() {
	$('#level').text(level);  /* Update the level */ 
}

function levelUp(){
	kills++;
	keepKills();
	if(kills % 10 == 0){
		level++;
	    keepLevel();
	    
	    enemyCount += 2;
	}
}

function updateGame() {
    if(game.state == "playing" && enemies.length == 0) {
        /*
        game.state = "won";
        overlay.title = "SWARM DEAD";
        overlay.subtitle = "press space to play again";
        overlay.counter = 0;
        */
        game.state = "start";
    }
    if(game.state == "over" && keyboard[32]) {
        game.state = "start";
        player.state = "alive";
        overlay.counter = -1;
    }
    if(game.state == "won" && keyboard[32]) {
        game.state = "start";
        player.state = "alive";
        overlay.counter = -1;
    }
    
    if(overlay.counter >= 0) {
        overlay.counter++;
    } 
    
}
function updatePlayer() {
    if(player.state == "dead") return;
    
    //left arrow
	if(keyboard[37])  { 
	    player.x -= 10; 
	    if(player.x < 0) player.x = 0;
	}	
	//right arrow
	if(keyboard[39]) { 
	    player.x += 10;	
	    var right = canvas.width - player.width;
	    if(player.x > right) player.x = right;
	}
	//up arrow
	if(keyboard[38]) { 
	    player.y -= 10;	
	    if(player.y < 0) player.y = 0;
	    //level -= 1;
	    //keepLevel();
	}	
	//down arrow
	if(keyboard[40]) { 
	    player.y += 10;	
	    if(player.y > 550) player.y = 550; /* height of canvas - height of player */
	    //level++;
	    //keepLevel();	
	}
	
	//space bar
	if(keyboard[32]) {
		if(!keyboard.fired) { 
			firePlayerBullet(); 
			keyboard.fired = true;
		}
		
	//double shot
	if((keyboard[32]) && (level >= 20)) { 
			firePlayerBullet();
			$(this).delay(1000, function(){
				firePlayerBullet();
			});
			keyboard.fired = true;
		}
	} else {
		keyboard.fired = false;
	}
	
	if(player.state == "hit") {
	    player.counter++;
	    if(player.counter >= 40) {
	        player.counter = 0;
	        player.state = "dead";
	        game.state = "over";
	        overlay.title = "GAME OVER";
	        overlay.subtitle = "press space to play again";
	        overlay.counter = 0;
	    }
	}
}


playerBulletW = 15;
playerBulletH = 15;

function firePlayerBullet() {
	//create a new bullet
	playerBullets.push({
		//x: player.x,
		x: player.x+((player.width/2)-(playerBulletW/2)),
		y: player.y - 5,
		//width:10,
		//height:10,
		width:playerBulletW,
		height:playerBulletH,
		counter:0,
	});
}

function updatePlayerBullets() {
	//move each bullet
	for(i in playerBullets) {
		var bullet = playerBullets[i];
			bullet.y -= 4;
			bullet.x += 0;
		if(level >= 5){
			bullet.y -= 8;
		}
		if (level >= 10 && level <= 14){
			bullet.y -= 16;
			playerBulletW = 20;
			playerBulletH = 20;
		} if (level >= 15 && level <=19){
			bullet.y -= 5;
			playerBulletW = 25;
			playerBulletH = 25;
			bullet.x += Math.sin(bullet.counter*Math.PI*2/85)*4;
			bullet_image = new Image();
			bullet_image.src = "images/game/bullets2.png";
		} if (level >= 20 && level <= 24) {
			bullet.y -= 20;
			bullet.x += 0;
			playerBulletW = 10;
			playerBulletH = 10;
			bullet_image = new Image();
			bullet_image.src = "images/game/bullets3.png";
		} if (level >= 25) {
			bullet.y -= 18;
			bullet.x += 0;
			playerBulletW = 30;
			playerBulletH = 30;
			bullet_image = new Image();
			bullet_image.src = "images/game/bullets4.png";
		}
		bullet.counter++;
	}
	//remove the ones that are off the screen
	playerBullets = playerBullets.filter(function(bullet){
		return bullet.y > 0;
	});
}

setInterval(function() {
	
}, 5000);

// ============== Enemy =============
function updateEnemies() {
    
    if(game.state == "start") {
        enemies = [];
        enemyBullets = [];
        for(var i=0; i<enemyCount; i++) { /* NOTE: the 10 controls how many enemies */
            enemies.push({
                    x: Math.floor(Math.random()*750), /* creates spacing for the enemies (65 - 50 = 15px of spacing | note: green goes past spacing  */
                    y: Math.floor(Math.random()*200) - 100,
                   width: (75*0.6),  /* What the f**K does this doo? - Controls size allowed */
                    height: (51*0.6), 
                    
                    state: "alive", // the starting state of enemies
                    counter: 0, // a counter to use when calculating effects in each state
                    phase: Math.floor(Math.random()*1000), //make the enemies not be identical /* And controls shot variety */
                    
                    //shrink: 40,  /* BLOOM!!! headshot */
                    
            });
        }
        game.state = "playing";
    }
    
    
    //for each enemy
    for(var i=0; i<enemyCount; i++) {
        var enemy = enemies[i];
        if(!enemy) continue;
        
        //float back and forth when alive
        if(enemy && enemy.state == "alive") {
            enemy.counter++;
            enemy.x += Math.sin(enemy.counter*Math.PI*2/85)*4; /* controls speed of enemies and distance traveled (I don't understand How ... Math.sin(bullet.counter*Math.PI*2/50 {controls the distance they move back and forth})*10 {controls speed};)*/
            
            enemy.y += (level*0.05);  /* Space Invaders 2!! now they move down too */
            
            
            if((enemy.counter + enemy.phase) % (200) == 0) {  
            
                   enemyBullets.push(createEnemyBullet(enemy));
            }
            
            if(enemy.y == 580) {
            	player.state = 'hit';
            }
        }
        
        //enter the destruction state when hit
        if(enemy && enemy.state == "hit") {
            enemy.counter++;
            
            //finally be dead so it will get cleaned up
            if(enemy.counter >= 20) {
                enemy.state = "dead";
                enemy.counter = 0;
                
                score += 25;
               	keepScore(); /* let's update that score */
               	
               	levelUp();
            }
        }
    }
    
    //remove the dead ones
    enemies = enemies.filter(function(e) {
            if(e && e.state != "dead") return true;
            return false;
    });
}


function updateEnemyBullets() {
    for(var i in enemyBullets) {
        var bullet = enemyBullets[i];
        bullet.y += (level*1.11); /* controls how fast the bullets move!!  ( I actually do know how) */
        
        bullet.x += Math.sin(bullet.counter*Math.PI*1/100*9);  /* sidewinder bullets Biatch! (don't know how this works exactly) */
        
        bullet.counter++;
        
    }
}

// =========== check for collisions ===

function checkCollisions() {
    for(var i in playerBullets) {
        var bullet = playerBullets[i];
        for(var j in enemies) {
            var enemy = enemies[j];
            if(collided(bullet,enemy)) {
                bullet.state = "hit";
                enemy.state = "hit";
                enemy.counter = 0;

            }
        }
    }
    
    if(player.state == "hit" || player.state == "dead") return;
    for(var i in enemyBullets) {
        var bullet = enemyBullets[i];
        if(collided(bullet,player)) {
            bullet.state = "hit";
            player.state = "hit";
            player.counter = 0;
            
          
        }
    }
}

function collided(a, b) {
    
    //check for horz collision
    if(b.x + b.width >= a.x && b.x < a.x + a.width) {
        //check for vert collision
        if(b.y + b.height >= a.y && b.y < a.y + a.height) {
            return true;
        }
    }
    
    //check a inside b
    if(b.x <= a.x && b.x + b.width >= a.x+a.width) {
        if(b.y <= a.y && b.y + b.height >= a.y + a.height) {
            return true;
        }
    }
    
    //check b inside a
    if(a.x <= b.x && a.x + a.width >= b.x+b.width) {
        if(a.y <= b.y && a.y + a.height >= b.y+b.height) {
            return true;
        } 
    }
    
    return false;
}

//====================================


function doSetup() {
	attachEvent(document, "keydown", function(e) {
		keyboard[e.keyCode] = true;
	});
	attachEvent(document, "keyup", function(e) {
		keyboard[e.keyCode] = false;
	});
}

function attachEvent(node,name,func) {
    if(node.addEventListener) {
        node.addEventListener(name,func,false);
    } else if(node.attachEvent) {
        node.attachEvent(name,func);
    }
};

