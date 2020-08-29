var trex,trexanimation,trexcollide;
var ground,groundanimation,invisibleground;
var cloud1;
var cactus1,cactus2,cactus3,cactus4,cactus5,cactus6;
var ObstaclesGroup,CloudsGroup;
var gameState;
var gameOver,go;
var restart,re;
var score,highScore;
var jumps,dies,checkpoints;

function preload(){
  trexanimation=loadAnimation("trex1.png","trex3.png","trex4.png");
  trexcollide=loadImage("trex_collided.png");
  groundanimation=loadImage("ground2.png");
  cloud1=loadImage("cloud.png");
  cactus1=loadImage("obstacle1.png");
  cactus2=loadImage("obstacle2.png");
  cactus3=loadImage("obstacle3.png");
  cactus4=loadImage("obstacle4.png");
  cactus5=loadImage("obstacle5.png");
  cactus6=loadImage("obstacle6.png");
  go=loadImage("gameOver.png");
  re=loadImage("restart.png");
  jumps=loadSound("jump.mp3");
  dies=loadSound("die.mp3");
  checkpoints=loadSound("checkPoint.mp3");
}



function setup() {
  createCanvas(600, 200);
  trex=createSprite(50,180,20,50);
  trex.addAnimation("trexa",trexanimation);
  trex.addAnimation("trexb",trexcollide);
  trex.scale=0.5
  ground=createSprite(200,180,400,20);
  ground.addImage(groundanimation);
  
  ground.x = ground.width /2;
  invisibleground=createSprite(200,190,400,20);
  invisibleground.visible=false;
  ObstaclesGroup=new Group();
  CloudsGroup=new Group();
  gameState=1;
  gameOver = createSprite(300,100);
  restart = createSprite(300,140);
  gameOver.addImage(go);
  gameOver.scale = 0.5;
  restart.addImage(re);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  score=0;
  highScore=0;
  
  trex.debug=false;
  trex.setCollider("circle",0,0,30);
  
}

function draw() {
  background("white");
  
  text("Score: "+ score, 450,50);
  
  if(gameState===1){
    
     score = score + Math.round(getFrameRate()/60);
    
    ground.velocityX=-6
    
     //infinite ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&&trex.y>=156){
      trex.velocityY = -12 ;
      jumps.play();
    }
    
     spawnClouds();
    spawnObstacles();

    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    if (score>0 && score%100 === 0){
      checkpoints.play();
    }
    
    
    if(ObstaclesGroup.isTouching(trex)){
      gameState = 0;
      dies.play();
      
    }
    
  } 
  else if(gameState===0){
    
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trexb",trexcollide);
    
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    if(highScore<score){
      highScore=score;
    }
    
  } 
  
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  
  
  if(highScore>0){
   text("HI: "+ highScore, 300,50); 
  }
 
  
  
 // console.log(trex.y)
    
  
  

  
  trex.collide(invisibleground);
  
   
  
  
  
  drawSprites();
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    //cloud.setAnimation("cloud");
    cloud.addImage(cloud1)
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 220;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    CloudsGroup.add(cloud);
  }
  
}





function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round (random(1,6));
    
    switch(rand){
      case 1: obstacle.addImage(cactus1); break;
      case 2: obstacle.addImage(cactus2); break;
      case 3: obstacle.addImage(cactus3); break;
      case 4: obstacle.addImage(cactus4); break;
      case 5: obstacle.addImage(cactus5); break;
      case 6: obstacle.addImage(cactus6); break;
      
      default:break;
    }
      
    
    //obstacle.setAnimation("obstacle" + rand);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    ObstaclesGroup.add(obstacle);
  }
}


function reset(){
  gameState = 1;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("trexa",trexanimation);
  
  score = 0;
  
}


