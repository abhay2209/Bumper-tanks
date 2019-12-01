//GENERAL PURPOSE FUNCTIONS
//Movement Controller
var time = 0;
function OBJECT_CONTROLLER(obj){
  if(KEY_MAP[W_KEY]){
      if(speed_trigger == 1)
      {
        obj.accelRate = 1;
        obj.maxVel = 8;
        setTimeout(changeSpeed, 10000);
      }
      else
      {
        obj.accelRate = 0.5;
        obj.maxVel = 4;
      }
      obj.accelerate(1);
  }else if(KEY_MAP[S_KEY]){
    if(speed_trigger == 1)
    {
      obj.accelRate = 1;
      obj.maxVel = 8;
      setTimeout(changeSpeed, 10000);
    }
    else
    {
      obj.accelRate = 0.5;
      obj.maxVel = 4;
    }
      obj.accelerate(0);
  }else{
      obj.deccelerate();
  }

  if(KEY_MAP[A_KEY])      
    obj.turnLeft()
  else if(KEY_MAP[D_KEY]) 
    obj.turnRight()
  else                          
    obj.stopTurn()

  if(KEY_MAP[H_KEY])      
    obj.turrentLeft()
  else if(KEY_MAP[K_KEY]) 
    obj.turrentRight()
  else                          
    obj.stopTurrent()

  if(KEY_MAP[J_KEY])
  {
    KEY_MAP[J_KEY] = 0
    SOCKET.emit('cs', obj.playerNum, powerSize_trigger, bullets_trigger)
  }
}
function changePower(){
  powerSize_trigger = 0;
}

function changeBullets(){
  bullets_trigger = 0;
}

function changeSpeed(){
  speed_trigger = 0;
}
//Update position of controlled objects
function OBJECT_MOVER(obj){
  if(obj.angVel != 0){
      Body.rotate(obj.body, obj.angVel);
      Body.rotate(obj.turrentRing, obj.angVel)
  }
  if(obj.angVel2 != 0){
    Body.rotate(obj.turrentRing, obj.angVel2);
}
  if(obj.linVel != 0){
  Body.setVelocity(obj.body,
      { x: -Math.cos(obj.body.angle)*obj.linVel, y: -Math.sin(obj.body.angle)*obj.linVel});
  }
}

function respawnPowerup(xPos){
  var newItem = new Items(xPos, 300, 90, 20, 20);
  World.add(worldObject, [newItem.body]);
}
//function to detect collision
function detectCollision(){
  Events.on(engineObject, 'collisionStart', function(event) {
    let pairs = event.pairs;
    pairs.forEach(function(pair) {
      if(pair.bodyA.label ==='tank' && pair.bodyB.label ==='bullet'){
        World.remove(worldObject, pair.bodyB);
        pair.bodyA.parent.health -= pair.bodyB.damage;
        console.log(pair.bodyA.parent.health);
      }
      else if(pair.bodyA.label ==='bullet' && pair.bodyB.label ==='tank'){

        World.remove(worldObject, pair.bodyA);
        pair.bodyB.parent.health -= pair.bodyA.damage;
        console.log(pair.bodyA.parent.health);

      }else if(pair.bodyA.label ==='bullet' && pair.bodyB.label ==='barrier'){
        World.remove(worldObject, pair.bodyA);
      }else if(pair.bodyA.label ==='barrier' && pair.bodyB.label ==='bullet'){
        World.remove(worldObject, pair.bodyB);
      }else if(pair.bodyA.label ==='wall' && pair.bodyB.label ==='bullet'){
        World.remove(worldObject, pair.bodyB);

      }else if(pair.bodyA.label ==='tank'&& pair.bodyB.label ==='powerSize'){
        var newX = pair.bodyB.x;
        World.remove(worldObject, pair.bodyB);
        setTimeout(respawnPowerup, 5000, newX);
        powerSize_trigger = 1;
      }else if(pair.bodyA.label ==='tank'&& pair.bodyB.label ==='health'){
        var newX = pair.bodyB.x;
        World.remove(worldObject, pair.bodyB);
        setTimeout(respawnPowerup, 5000, newX);
        pair.bodyA.parent.health +=20;
        if(pair.bodyA.parent.health>100){
            pair.bodyA.parent.health=100;
         }
      }else if(pair.bodyA.label ==='tank'&& pair.bodyB.label ==='speed'){
        speed_trigger = 1;
        var newX = pair.bodyB.x;
        World.remove(worldObject, pair.bodyB);
        setTimeout(respawnPowerup, 5000, newX);
      }else if(pair.bodyA.label ==='tank'&& pair.bodyB.label ==='moreBullets'){
        bullets_trigger = 1;
        var newX = pair.bodyB.x;
        World.remove(worldObject, pair.bodyB);
        setTimeout(respawnPowerup, 5000, newX);
    };
  });
});
}
