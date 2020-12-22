var mario,mario_running, mario_collided,jump, 
    brickImage,bricksGroup,checkPoint;
var die,bg;
var ground, groundImage, invisibleGround;
var obstacle1,obstacle2, obstacle3, obstacle4, obstaclesGroup;
var gameOver, restart;
var score = 0;
var backgroundImg;
var PLAY = 1;
var END = 0;
var gameState = PLAY;  
var jumpSound, dieSound, checkpointSound;

function preload(){
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  backgroundImg = loadImage("bg.png")
  groundImage = loadImage("ground2.png")
  brickImage = loadImage("brick.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  mario_running = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png")
   mario_collided = loadAnimation("collided.png");
  
}
function setup(){
  createCanvas(600,400)
  mario= createSprite(100,300,200,200);
  mario.addAnimation("moving", mario_running );
  mario.addAnimation("collided", mario_collided);
  
  ground = createSprite(100,370,300,40);
  ground.x=ground.width/2;
  ground.addImage("ground",groundImage)
  brickImage  = loadImage("brick.png")
  
  invisibleGround = createSprite(100,350,400,30);
  invisibleGround.visible = false;
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup = new Group();
  bricksGroup = new Group();
}
function draw (){
  background(backgroundImg);
  text("score:"+ score,500,20);
  
  
  if (gameState === PLAY){
     
    ground.velocityX = -(10 + 3* score/100)
     score = score + Math.round(getFrameRate()/60);
   if(score>0 && score%100 === 0){
       checkpointSound.play() 
    }
    // to jump mario 
    if((touches.length > 0 || keyDown("space")) && mario.y>=250){
      jumpSound.play( )
    mario.velocityY=-10;
       touches = [];
  }
    // to add gravity to mario 
     mario.velocityY = mario.velocityY + 0.8;
    if (ground.x < 0){
      ground.x = ground.width/2;
  }
     mario.collide(invisibleGround);
    if(obstaclesGroup.isTouching(mario)){
      dieSound.play( )
      gameState=END;
    }
  spawnObstacles();
  spawnBricks();
  }
  else if (gameState === END){
    ground.velocityX=0;
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
     mario.changeAnimation("collided",mario_collided);
    
     //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
       if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  console.log(mario.y)
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,310,100,40);
    obstacle.setCollider('circle',0,0,20);
    //obstacle.debug = true;
    obstacle.velocityX = -8
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function spawnBricks() {
  //write code here to spawn the bricks
  if (frameCount % 60 === 0) {
    var brick = createSprite(600,300,40,10);
    brick.y = Math.round(random(100,200));
    brick.addImage(brickImage);
 
    brick.velocityX = -6;
    
     //assign lifetime to the variable
    brick.lifetime = 200;
    
    //adjust the depth
   brick.depth = mario.depth;
    mario.depth = mario.depth + 1; 
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("moving",mario_running);
  
  score = 0;
}
