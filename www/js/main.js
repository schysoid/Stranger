var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

var player;
var cursors;
var tap;
var test1 = 1;
var red = "red";
var blue = "blue";
var npcSpeed = 60;
var worldWidth = 2240;
var worldHeight = 1000;
var border = worldWidth / 2;
var npcGroup;
var npcLocalPop = 10;


function adjust() {
    var divgame = document.getElementById("game");
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";

}


window.addEventListener('resize', function () {
    adjust();
});


function preload() {

    game.load.image('background', 'images/blue-red-grid-1920x1920.png');
    game.load.image('player', 'images/phaser-dude.png');
    game.load.image('npc', 'images/phaser-dude.png');
    game.load.image('hearth_blue', 'images/hearth_blue.png');
    game.load.image('hearth_red', 'images/hearth_red.png');

}


function create() {


    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.add.tileSprite(0, 0, worldWidth, worldHeight, 'background');
    game.world.setBounds(0, 0, worldWidth, worldHeight);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    game.physics.arcade.enable(player);

    //npc1 = game.add.sprite(game.world.centerX, game.world.centerY, 'npc1');
    //game.physics.arcade.enable(npc1);

    //moveNpc (npc1,npc1DestX,npc1DestY,npcSpeed);

    //SPAWN NPCS
    npcGroup = game.add.group();
    npcGroup.add(player);
    var npc = new Npc(game, worldWidth / 2, worldHeight / 2, red);
    game.add.existing(npc);
    npcGroup.add(npc);




    //RED
    for (i = 1; i <= npcLocalPop; i++) {
        npc = new Npc(game, worldWidth / 4 + border, (worldHeight / npcLocalPop) * i, red);
        game.add.existing(npc);
        npcGroup.add(npc);
    }

    //BLUE
    for (i = 1; i <= npcLocalPop; i++) {
        npc = new Npc(game, worldWidth / 4, (worldHeight / npcLocalPop) * i, blue);
        game.add.existing(npc);
        npcGroup.add(npc);
    }


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
    if (game.input.pointer1.isDown) {
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
    if (cursors.up.isDown) {
        player.body.velocity.y = -300;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 300;
    }

    if (cursors.left.isDown) {
        player.body.velocity.x = -300;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 300;
    }

}

function render() {

    //game.debug.pointer(game.input.mousePointer);
    // game.debug.pointer(game.input.pointer1);


}

// NPC
Npc = function (game, x, y, npcTerritory) {

    var myTerritory;
    var npcEmoticon;

    var origX;
    var origY;
    var destX;
    var destY;
    var dist;

    var mojo;
    var lastMojoChange;

    Phaser.Sprite.call(this, game, x, y, "npc");
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(1, 1);


    if (npcTerritory == blue) {
        npcEmoticon = this.addChild(game.make.sprite(-14, -50, 'hearth_blue'));
        npcEmoticon.scale.setTo(0.1, 0.1);
    } else if (npcTerritory == red) {
        npcEmoticon = this.addChild(game.make.sprite(-10, -50, 'hearth_red'));
        npcEmoticon.scale.setTo(0.01, 0.01);
    }

    NpcCreate(this);
    moveNpc(this, npcTerritory);

    // console.log(mycolor +" "+destX);
};

Npc.prototype = Object.create(Phaser.Sprite.prototype);
Npc.prototype.constructor = Npc;

NpcCreate = function (npc) {

    npc.mojo = Math.round(Math.random() * 5 - 2.5);
    var lastMojoChange = Phaser.Time.now;
    //console.log(npc.mojo);

};

Npc.prototype.update = function () {
    game.physics.arcade.collide(npcGroup, npcGroup, npcCollideCallback);

    checkAndStop(this);
};

npcCollideCallback = function (npc1, npc2) {

    if (npc1.Type == Npc) {
        moveNpc(npc1, npc1.myTerritory);
    }

    moveNpc(npc2, npc2.myTerritory);

    //UPDATE MOJO
    if(npc1.mojo < npc2.mojo){
   
        npc1.mojo  +=1;
        npc2.mojo  -=1;
    }
        
     if(npc1.mojo > npc2.mojo){
        npc1.mojo  +=1;
        npc2.mojo  -=1;
    }
    
    
    console.log(npc1.mojo + " " + npc2.mojo);
};

moveNpc = function (npc, npcTerritory) {

    npc.myTerritory = npcTerritory;
    //console.log(npc.myTerritory);

    var destX = (Math.random() / 2) * (worldWidth);
    //var mycolor = npcTerritory;



    if (npcTerritory == red) {
        destX = destX + border;
    }

    var destY = Math.random() * worldHeight;

    npc.origX = npc.x;
    //console.log(npc.origX);
    npc.origY = npc.y;
    npc.destX = destX;
    npc.destY = destY;
    npc.dist = Phaser.Math.distance(npc.origX, npc.origY, destX, destY);

    //npc.mojo = 1;



    //console.log(npc.destX);

    game.physics.arcade.moveToXY(npc, destX, destY, npcSpeed);


};

checkAndStop = function (npc) {

    // console.log(Phaser.Math.distance(npc.origX,npc.origY,npc.destX,npc.destY));
    if (Phaser.Math.distance(npc.x, npc.y, npc.origX, npc.origY) >= npc.dist) {
        npc.body.velocity.setTo(0, 0);
        moveNpc(npc, npc.myTerritory);
    }
};