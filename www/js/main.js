
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var player;
var cursors;
var tap;
var test1 = 1;
var red = "red";
var npcSpeed = 200;
var border = 960;


function adjust() {
    var divgame = document.getElementById("game");
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";
}


window.addEventListener('resize', function() {adjust();});


   function preload() {

    game.load.image('background','images/blue-red-grid-1920x1920.png');
    game.load.image('player','images/phaser-dude.png');
    game.load.image('npc','images/phaser-dude.png');

}


function create() {
    console.log(test2);

    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.add.tileSprite(0, 0, 2240, 2240, 'background');
    game.world.setBounds(0, 0, 2240, 2240);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    game.physics.arcade.enable(player);

    //npc1 = game.add.sprite(game.world.centerX, game.world.centerY, 'npc1');
    //game.physics.arcade.enable(npc1);

    //moveNpc (npc1,npc1DestX,npc1DestY,npcSpeed);

    //SPAWN NPCS
    var npc = new Npc(game, 700+border, 750, "red");
    game.add.existing(npc);
    npc = new Npc(game, 750, 700, "blue");
    game.add.existing(npc);


    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.setScreenSize(true);
    game.scale.refresh();



}


//var npc1DestX = Math.random ()*game.width;
//var npc1DestY = Math.random ()*game.height;






function update() {

   // player.body.setZeroVelocity();
    player.body.velocity.setTo(0, 0);
    //
/*
//Mouse down
   if (game.input.mousePointer.isDown)
    {
         player.body.moveUp(300);
        //  400 is the speed it will move towards the mouse
       // game.physics.arcade.moveToPointer(player, 400);

        //  if it's overlapping the mouse, don't move any more
      //  if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
       // {
         //   sprite.body.velocity.setTo(0, 0);
       // }
    }
   */

//Tap
   //  only move when you click
    if (game.input.pointer1.isDown)
    {
       //  player.body.moveUp(300);
        //  400 is the speed it will move towards the mouse
        game.physics.arcade.moveToPointer(player, 400);

        //  if it's overlapping the mouse, don't move any more
       // if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
        //{
            //sprite.body.velocity.setTo(0, 0);
        //}
    }



    //Cursor
    if (cursors.up.isDown)
    {
        player.body.velocity.y = -300;
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 300;
    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
    }

}

function render() {

   //game.debug.pointer(game.input.mousePointer);
   // game.debug.pointer(game.input.pointer1);


}

// NPC
Npc = function (game, x, y, npccolor) {

    var mycolor = npccolor;
    var origX;
    var origY;
    var destX;
    var destY;
    var dist;

    Phaser.Sprite.call(this, game, x, y, "npc");
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds=true;
    this.body.bounce.setTo(1, 1);
    moveNpc(this, mycolor);
    //console.log(mycolor +" "+destX);
};

Npc.prototype = Object.create(Phaser.Sprite.prototype);
Npc.prototype.constructor = Npc;

Npc.prototype.update = function () {
   // game.physics.arcade.collide(this, platformgroup, moveNpc);

    checkAndStop(this);
};

function checkAndStop(npc){
   // console.log(Phaser.Math.distance(npc.origX,npc.origY,npc.destX,npc.destY));
   if(Phaser.Math.distance(npc.x,npc.y,npc.origX,npc.origY) >= npc.dist-10) {
    npc.body.velocity.setTo(0,0);
    moveNpc(npc);
  }
}

function moveNpc (npc, mycolor){

    console.log(mycolor);

    var destX = Math.random ()*(game.width);

    if(mycolor == "red"){
        destX=destX+border;
    }

    var destY = Math.random ()*game.height;

    npc.origX = npc.x;
    npc.origY = npc.y;
    npc.destX = destX;
    npc.destY = destY;
    npc.dist = Phaser.Math.distance(npc.origX,npc.origY,destX,destY);


    //console.log(npc.destY);

    game.physics.arcade.moveToXY(npc, destX, destY,npcSpeed);

    // console.log(npc.body.velocity);
}

