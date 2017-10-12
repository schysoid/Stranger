var Phaser;
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'phaser-example', {
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
var scaleMod = 1.5;
var npcSpeed = 80 * scaleMod;
var playerSpeed = npcSpeed * 4;
var worldWidth = 2240;
var worldHeight = 1000;
var border = worldWidth / 2;
var npcGroup;
var gameObjectsGroup;
var npcLocalPop = 5;
var gauge;
var gaugepointer;
var globalTolerance = 0;
var bubbleSpawnFreq = 12000;
var lastSpawn;



function preload() {


    game.load.image('background', 'images/blue-red-grid-1920x1920.png');
    game.load.image('player', 'images/char_idle0.png');
    game.load.spritesheet('char', 'images/char.png', 32, 64, 6);
    game.load.image('bubbleTalk', 'images/bubble_talk.png');
    game.load.image('bubbleyell', 'images/bubble_yell.png');
    game.load.image('newspaper', 'images/newspaper.png');
    game.load.spritesheet('emoticons', 'images/icons.png', 32, 32, 22);
    // game.load.spritesheet('tornado', 'images/tornado.png', 24, 24, 3);
    game.load.image('festival', 'images/Diversity.png');
    game.load.image('gauge', 'images/gauge.png');
    game.load.image('pointer', 'images/pointer.png');
    game.load.spritesheet('bubble', 'images/bubble.png', 64, 64, 4);



}


function create() {


    //PHYSICS
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.add.tileSprite(0, 0, worldWidth, worldHeight, 'background');
    game.world.setBounds(0, 0, worldWidth, worldHeight);
    game.physics.startSystem(Phaser.Physics.ARCADE);



    //PLAYER
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'char');
    player.scale.setTo(scaleMod, scaleMod);
    game.physics.arcade.enable(player);
    player.tolerance = 0;

    //player.tolerance;



    //COLISION GROUP
    gameObjectsGroup = game.add.physicsGroup();

    npcGroup = game.add.physicsGroup();
    npcGroup.add(player);



    //NEWSPAPER
    var newspaperObj = new GameObject(game, worldWidth / 2 - 500, worldHeight / 2 - 40, "newspaper", blue);
    game.add.existing(newspaperObj);
    gameObjectsGroup.add(newspaperObj);
    newspaperObj.scale.setTo(.5 * scaleMod, .5 * scaleMod);

    //FESTIVAL
    var festivalObj = new GameObject(game, worldWidth / 2 + 500, worldHeight / 2 - 40, "festival", red);
    game.add.existing(festivalObj);
    gameObjectsGroup.add(festivalObj);
    festivalObj.scale.setTo(1 * scaleMod, 1 * scaleMod);

    //BUBBLE CONTAINER
    lastSpawn = Date.now();



    //SPAWN NPCs
    var npc;


    //RED
    for (var i = 1; i <= npcLocalPop; i++) {
        npc = new Npc(game, worldWidth / 4 + border, (worldHeight / npcLocalPop) * i, red);
        npc.scale.setTo(1 * scaleMod, 1 * scaleMod);
        npc.animations.add('walk', [4, 5], 2, true);
        npc.animations.add('idle', [3], null, false);
        npc.animations.play('walk');
        npc.animations.updateIfVisible = false;

        game.add.existing(npc);


        npcGroup.add(npc);
    }

    //BLUE
    for (i = 1; i <= npcLocalPop; i++) {
        npc = new Npc(game, worldWidth / 4, (worldHeight / npcLocalPop) * i, blue);
        npc.scale.setTo(1 * scaleMod, 1 * scaleMod);
        npc.animations.add('walk', [4, 5], 2, true);
        npc.animations.add('idle', [3], null, false);
        npc.animations.play('walk');
        npc.animations.updateIfVisible = false;

        game.add.existing(npc);


        npcGroup.add(npc);
    }


    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    //game.scale.setScreenSize(true);
    game.scale.refresh();

    //HUD
    gauge = game.add.sprite((game.camera.width / 2), game.camera.height / 15, 'gauge');
    gauge.scale.setTo(2, 2);
    gauge.x -= gauge.width / 2;
    gauge.fixedToCamera = true;

    gaugepointer = game.add.sprite(gauge.x + (gauge.width / 2), gauge.y + (gauge.height / 1.2), 'pointer');
    gaugepointer.anchor.setTo(.5, .8);
    //gaugepointer.x -= gaugepointer.width / 2;

    gaugepointer.scale.setTo(2, 2);
    gaugepointer.fixedToCamera = true;


}





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
        //game.physics.arcade.moveToPointer(player, playerSpeed);
        game.physics.arcade.moveToXY(player, game.input.pointer1.worldX - 50, game.input.pointer1.worldY - 80, playerSpeed);

        //  if it's overlapping the mouse, don't move any more
        // if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
        //{
        //sprite.body.velocity.setTo(0, 0);
        //}
    }



    //Cursor
    if (cursors.up.isDown) {
        player.body.velocity.y = -playerSpeed;
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = playerSpeed;
    }

    if (cursors.left.isDown) {
        player.body.velocity.x = -playerSpeed;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = playerSpeed;
    }


    //COLLISIONS
    //game.physics.arcade.collide(npcGroup, npcGroup, npcCollision);
    // game.physics.arcade.overlap(newspaperObj, npcGroup, newspaperColision);

    bubbleContainerSpawner();
    // console.log(globalTolerance);

}

var updateGlobalTolerance = function () {
    var toleranceCounter = 0;

    for (var i = 0, len = npcGroup.children.length; i < len; i++) {
        toleranceCounter += npcGroup.children[i].tolerance;
        // console.log(npcGroup.children[i].tolerance + " / " + toleranceCounter);

    }


    globalTolerance = (toleranceCounter / npcGroup.children.length) * 45;
    gaugepointer.angle = globalTolerance;
    // console.log(toleranceCounter / npcGroup.children.length);
};

function render() {

    //game.debug.pointer(game.input.mousePointer);
    // game.debug.pointer(game.input.pointer1);


}

// BUBBLE CONTAINER
var bubbleContainer = function (game, x, y, objToSpawn, teritory) {
    var objname;
    var objType;
    var myTerritory;

    Phaser.Sprite.call(this, game, x, y, "bubble");

    this.anchor.setTo(0.5);
    this.alpha = .5;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    var objInside;
    if (objToSpawn == "newspaper") {


        objInside = this.addChild(game.add.sprite(0, 0, 'emoticons'));
        objInside.anchor.setTo(.5);
        objInside.scale.setTo(.8 * scaleMod, .8 * scaleMod);
        objInside.frame = 0;

    }
    if (objToSpawn == "festival") {

        objInside = this.addChild(game.add.sprite(0, 0, 'emoticons'));
        objInside.anchor.setTo(.5);
        objInside.scale.setTo(.8 * scaleMod, .8 * scaleMod);
        objInside.frame = 6;

    }

    bubbleContainerCreate(this, objToSpawn, teritory);
    if (objToSpawn == "newspaper") {
        game.time.events.add(20000, spawnNewspaper, this, this.x, this.y, objToSpawn, teritory);

    }

    game.time.events.add(20000, destroyObject, this, this);

};

bubbleContainer.prototype = Object.create(Phaser.Sprite.prototype);
bubbleContainer.prototype.constructor = bubbleContainer;

function bubbleContainerCreate(ref, objToSpawn, teritory) {
    ref.objType = objToSpawn;
    ref.myTerritory = teritory;
    ref.animations.add('pulse', [0, 1, 2, 3], 4, true);
    ref.animations.play('pulse');

};

bubbleContainer.prototype.update = function () {
    game.physics.arcade.overlap(this, player, bubbleCollision);


};

var bubbleCollision = function (colObj, playerRef) {
    console.log(colObj.objType);

    if (colObj.objType == "newspaper") {
        colObj.destroy();

    }


    if (colObj.objType == "festival") {

        //FESTIVAL
        var festivalObj = new GameObject(game, colObj.x, colObj.y, "festival", red);
        game.add.existing(festivalObj);
        gameObjectsGroup.add(festivalObj);
        festivalObj.scale.setTo(1 * scaleMod, 1 * scaleMod);


    }

    colObj.destroy();

};

var bubbleContainerSpawner = function () {

    if (Date.now() >= (lastSpawn + bubbleSpawnFreq)) {
        lastSpawn = Date.now();

        var teritory;
        var x;
        var objType;

        if (Math.random() >= .5) {
            teritory = red;
            x = (Math.random() / 2) * (worldWidth);
            x = x + border;
        }
        else {
            teritory = blue;
            x = (Math.random()) * (worldWidth);

        }

        if (Math.random() >= .5) {
            objType = "newspaper";
        }
        else {
            objType = "festival";
        }

        spawnBubbleContainer(x, worldHeight * Math.random(), objType, teritory);
    }

};

var spawnBubbleContainer = function (x, y, objToSpawn, teritory) {


    var bubbleObj = new bubbleContainer(game, x, y, objToSpawn, teritory);
    game.add.existing(bubbleObj);
    bubbleObj.scale.setTo(1 * scaleMod, 1 * scaleMod);


};

var spawnNewspaper = function (x, y, objToSpawn, teritory) {

    //NEWSPAPER
    var newspaperObj = new GameObject(game, x, y, objToSpawn, teritory);
    game.add.existing(newspaperObj);
    gameObjectsGroup.add(newspaperObj);
    newspaperObj.scale.setTo(.5 * scaleMod, .5 * scaleMod);
};



// GAME OBJECT
var GameObject = function (game, x, y, objToSpawn, teritory) {
    var objname;
    var objType;
    var myTerritory;

    if (objToSpawn == "newspaper") {
        Phaser.Sprite.call(this, game, x, y, "newspaper");
        var objTeritory;
        objTeritory = this.addChild(game.add.sprite(5 * scaleMod, 5 * scaleMod, 'emoticons'));
        objTeritory.scale.setTo(.7 * scaleMod, .7 * scaleMod);
        if (teritory == red) {
            objTeritory.frame = 7;
        }
        if (teritory == blue) {
            objTeritory.frame = 8;
        }


    }
    if (objToSpawn == "festival") {
        Phaser.Sprite.call(this, game, x, y, "festival");

    }
    //Phaser.Sprite.call(this, game, x, y, "newspaper");
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    //this.body.bounce.setTo(1, 1);

    this.body.immovable = true;
    GameObjCreate(this, objToSpawn, teritory);
    game.time.events.add(20000, destroyObject, this, this);


};
GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

function GameObjCreate(ref, objToSpawn, teritory) {
    ref.objType = objToSpawn;
    ref.myTerritory = teritory;
    addParticleEmitter(ref, [0]);




};
GameObject.prototype.update = function () {


};


function gameObjCollision(npc, colObj) {

    if (Date.now() >= (npc.colisionTime + 3000)) {
        npc.colisionTime = Date.now();

        // }


        if (colObj.objType == "newspaper" & npc.myTerritory == colObj.myTerritory) {
            //LOCAL RAGE
            npc.tolerance -= 1;
            timedBubbleUpdateStranger(npc);

            //  spawnParticles(npc, [0]);
        }
        if (colObj.objType == "newspaper" & npc.myTerritory != colObj.myTerritory) {
            //STRANGER CRIES

            if (npc.tolerance <= -1) {
                npc.tolerance -= 1;
                timedBubbleUpdateStranger(npc);
                // spawnParticles(npc, [0]);
            }
            else {
                // spawnParticles(npc, [9]);

            }
        }

        if (colObj.objType == "festival" & npc.myTerritory != colObj.myTerritory || colObj.objType == "festival" & npc.tolerance >= 1) {
            npc.tolerance += 1;
            timedBubbleUpdateStranger(npc);
            //spawnParticles(npc, [6]);
        }

        updateGlobalTolerance();

        if (colObj.objType == "festival" & npc.tolerance >= 1) {

            stop(npc);
            timedBubbleUpdateStranger(npc);
            game.time.events.add(2000, moveNpc, this, npc, npc.myTerritory);

        }
    }
};

var destroyObject = function (object) {
    object.destroy();
};

var spawnParticles = function (ref, spritesheetArrayFrame) {

    var emitter = game.add.emitter(0, 0, 5);
    //PARTICLES
    emitter.makeParticles('emoticons', spritesheetArrayFrame);
    ref.addChild(emitter);
    emitter.gravity = -100;
    emitter.setAlpha(1, 0, 2000);
    //emitter.rotation = 100;
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.setScale(.7, .7, .7, .7);
    emitter.setXSpeed(-30, 30);
    emitter.setYSpeed(-20, 20);
    emitter.start(true, 2000, null, 5);

};

var addParticleEmitter = function function_name(ref, spritesheetArrayFrame) {

    var emitter = game.add.emitter(0, 0, ref.width);

    //PARTICLES
    emitter.makeParticles('emoticons', spritesheetArrayFrame);
    ref.addChild(emitter);
    emitter.start(true, 2000, 100, 5);
}



// NPC
var Npc = function (game, x, y, npcTerritory) {
    var name = "npc";
    var myTerritory;
    var npcHearth;


    var origX;
    var origY;
    var destX;
    var destY;
    var dist;

    var tolerance;
    var lasttoleranceChange;
    var npcState;

    var colisionTime;

    var npcTravelBehav;

    Phaser.Sprite.call(this, game, x, y, "char");
    this.anchor.setTo(0.5);
    this.scale.setTo(scaleMod * .5, scaleMod * .5);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    //this.body.bounce.setTo(1, 1);

    NpcCreate(this, npcTerritory);
    moveNpc(this, npcTerritory);

    // console.log(mycolor +" "+destX);
};

Npc.prototype = Object.create(Phaser.Sprite.prototype);
Npc.prototype.constructor = Npc;

function NpcCreate(npc, npcTerritory) {
    //  npc.scale.setTo(scaleMod * .5, scaleMod * .5);


    npc.tolerance = Math.round(Math.random() * 5 - 2.5);
    npc.lasttoleranceChange = Phaser.Time.Time;
    // console.log(npc.tolerance);
    npc.myTerritory = npcTerritory;
    npc.colisionTime = Date.now();
    npc.npcTravelBehav = "Traveler";


    //BUBBLE
    npc.bubbleTalk = npc.addChild(game.add.sprite(npc.width / 2 * -1 * scaleMod, npc.height * -1.1 * scaleMod, 'bubbleTalk'));
    npc.bubbleTalk.scale.setTo(.5 * scaleMod, .7 * scaleMod);
    npc.bubbleTalk.animations.updateIfVisible = false;

    //YELLING BUBBLE
    npc.bubbleyell = npc.addChild(game.add.sprite(-15 * scaleMod, -50 * scaleMod, 'bubbleyell'));
    npc.bubbleyell.scale.setTo(.7 * scaleMod, .7 * scaleMod);
    npc.bubbleyell.animations.updateIfVisible = false;


    //EMOTICON
    npc.emoticon = npc.addChild(game.add.sprite((npc.width / 2 * -.75) * scaleMod, npc.height * -1.02 * scaleMod, 'emoticons'));
    npc.emoticon.scale.setTo(.6 * scaleMod, .6 * scaleMod);
    npc.emoticon.animations.updateIfVisible = false;


    //TERITORY
    npc.teritory = npc.addChild(game.add.sprite((npc.width / 2 * -1) * scaleMod, npc.height / 2 * -.2 * scaleMod, 'emoticons'));
    npc.teritory.scale.setTo(.3 * scaleMod, .3 * scaleMod);
    npc.emoticon.animations.updateIfVisible = false;


    //  npc.tornado.visible = false;
    npc.bubbleTalk.visible = false;
    npc.bubbleyell.visible = false;
    npc.emoticon.visible = false;
    //npc.teritory.visible = false;

    var animSpeed = .5;
    if (npc.myTerritory == blue) {
        npc.teritory.frame = 7;
        //DIRECTED AT LOCALS
        npc.emoticon.animations.add('Love', [6], animSpeed, false);
        npc.emoticon.animations.add('Happy', [5], animSpeed, false);
        npc.emoticon.animations.add('Neutral', [3], animSpeed, false);
        npc.emoticon.animations.add('Angry', [4], animSpeed, false);
        npc.emoticon.animations.add('Hate', [1], animSpeed, false);
        npc.emoticon.animations.add('tornado', [11, 12, 13], 10, true);
        npc.emoticon.animations.play('tornado');


    }
    else if (npc.myTerritory == red) {
        npc.teritory.frame = 8;

        npc.emoticon.animations.add('Love', [6], animSpeed, false);
        npc.emoticon.animations.add('Happy', [5], animSpeed, false);
        npc.emoticon.animations.add('Neutral', [3], animSpeed, false);
        npc.emoticon.animations.add('Angry', [4], animSpeed, false);
        npc.emoticon.animations.add('Hate', [1], animSpeed, false);
    }
    //DIRECTED AT STRANGERS
    npc.emoticon.animations.add('LoveStranger', [2], animSpeed, false);
    npc.emoticon.animations.add('HappyStranger', [5], animSpeed, false);
    npc.emoticon.animations.add('NeutralStranger', [3], animSpeed, false);
    npc.emoticon.animations.add('AngryStranger', [4], animSpeed, false);
    npc.emoticon.animations.add('HateStranger', [0], animSpeed, false);

    npc.emoticon.frame = 3;
    //updatetolerance(npc);

}

Npc.prototype.update = function () {

    game.physics.arcade.overlap(npcGroup, npcGroup, npcCollision);
    checkAndStop(this);
    game.physics.arcade.overlap(npcGroup, gameObjectsGroup, gameObjCollision);


};

function npcCollision(npc1, npc2) {
    if (npc1 == player) {
        if ((Date.now() >= (npc2.colisionTime + 3000))) {

            npc2.colisionTime = Date.now();
            timedBubbleUpdateStranger(npc2);
        }
        return;
    }
    if (npc2 == player) {
        if ((Date.now() >= (npc1.colisionTime + 3000))) {

            npc1.colisionTime = Date.now();
            timedBubbleUpdateStranger(npc1);
        }
        return;
    } //  console.log(npc1);


    if ((Date.now() >= (npc1.colisionTime + 3000)) || (Date.now() >= (npc2.colisionTime + 3000))) {
        npc1.colisionTime = Date.now();
        npc2.colisionTime = Date.now();

        var npc1Initialtolerance = npc1.tolerance;
        var npc2Initialtolerance = npc2.tolerance;

        //UPDATE tolerance
        if (npc1Initialtolerance + 1 < npc2Initialtolerance) {

            npc1.tolerance += 1;
            npc2.tolerance -= 1;
        }

        if (npc1Initialtolerance > npc2Initialtolerance + 1) {
            npc1.tolerance -= 1;
            npc2.tolerance += 1;
        }
        if (npc1.tolerance <= -2) {
            npc2.tolerance -= 1
            npc2.tolerance = -2
        }
        if (npc2.tolerance <= -2) {
            npc1.tolerance -= 1
            npc1.tolerance = -2
        }

        //npc1.colisionTime = Date.now();
        // npc2.colisionTime = Date.now();
        updateGlobalTolerance();

        if (npc1.myTerritory != npc2.myTerritory) {
            timedBubbleUpdateStranger(npc1);
            timedBubbleUpdateStranger(npc2);
        }
        if (npc1.myTerritory == npc2.myTerritory) {
            timedBubbleUpdate(npc1);
            timedBubbleUpdate(npc2);
        }

        stop(npc1);
        stop(npc2);


        game.time.events.add(2000, moveNpc, this, npc1, npc1.myTerritory);

        game.time.events.add(2000, moveNpc, this, npc2, npc2.myTerritory);
        // moveNpc(npc2, npc2.myTerritory);
    }
};

var timedBubbleUpdate = function (npc) {
    //game.time.events.add(200, makeBubbleVisible, this, npc);

    game.time.events.add(1000, updatetolerance, this, npc);
    game.time.events.add(2000, makeBubbleInvisible, this, npc);
}

var timedBubbleUpdateStranger = function (npc) {
    game.time.events.add(200, makeBubbleVisible, this, npc);
    game.time.events.add(1000, strangerEncounter, this, npc);
    game.time.events.add(2000, makeBubbleInvisible, this, npc);
}

function makeBubbleVisible(npc) {
    npc.bubbleTalk.visible = true;
    npc.emoticon.visible = true;
}

function makeBubbleInvisible(npc) {
    npc.bubbleTalk.visible = false;
    npc.emoticon.visible = false;
    npc.bubbleyell.visible = false;
    // npc.emoticon.animations.stop();
    // npc.tornado.visible = false;
}


function strangerEncounter(npc) {

    npc.emoticon.animations.stop();

    if (npc.tolerance >= 2) {
        npc.emoticon.frame = 2;
        //npc.emoticon.animations.play('LoveStranger');
    }
    if (npc.tolerance == 1) {
        npc.emoticon.frame = 5;
        // npc.emoticon.animations.play('HappyStranger');
    }
    if (npc.tolerance == 0) {
        npc.emoticon.frame = 3;
        // npc.emoticon.animations.play('NeutalStranger');
    }
    if (npc.tolerance == -0) {
        npc.emoticon.frame = 3;
        // npc.emoticon.animations.play('NeutralStranger');
    }
    if (npc.tolerance == -1) {
        npc.emoticon.frame = 4;
        //npc.emoticon.animations.play('AngryStranger');
    }
    if (npc.tolerance <= -2) {
        npc.emoticon.frame = 0;
        // npc.bubbleyell.visible = true;
        // npc.emoticon.animations.play('HateStranger');
    }


}

function updatetolerance(npc) {



    if (npc.tolerance >= 2) {
        npc.emoticon.frame = 6;
        npc.emoticon.animations.play('Love');
    }
    if (npc.tolerance == 1) {
        npc.emoticon.frame = 5;
        npc.emoticon.animations.play('Happy');
    }
    if (npc.tolerance == 0) {
        npc.emoticon.frame = 3;
        npc.emoticon.animations.play('Neutal');
    }
    if (npc.tolerance == -0) {
        npc.emoticon.frame = 3;
        npc.emoticon.animations.play('Neutral');
    }
    if (npc.tolerance == -1) {
        // npc.bubbleTalk.visible = true;
        // npc.tornado.visible = true;
        // npc.emoticon.frame = 4;
        npc.emoticon.animations.play('tornado');
    }
    if (npc.tolerance <= -2) {
        // npc.bubbleTalk.visible = true;
        // npc.tornado.visible = true;
        npc.emoticon.frame = 1;
        npc.emoticon.animations.play('Hate');
    }





}



function moveNpc(npc, npcTerritory) {

    npc.myTerritory = npcTerritory;

    if (npc.npcTravelBehav == "Homie") {

        var destX = (Math.random() / 2) * (worldWidth);
        if (npcTerritory == red) {
            destX = destX + border;
        }
    }
    if (npc.npcTravelBehav == "Traveler") {

        var destX = (Math.random()) * (worldWidth);

    }


    var destY = Math.random() * worldHeight;

    npc.origX = npc.x;
    //console.log(npc.origX);
    npc.origY = npc.y;
    npc.destX = destX;
    npc.destY = destY;
    npc.dist = Phaser.Math.distance(npc.origX, npc.origY, destX, destY);

    game.physics.arcade.moveToXY(npc, destX, destY, npcSpeed);

    //npc.animations.play('walk');

};

function stop(npc) {
    npc.body.velocity.setTo(0, 0);
}

function checkAndStop(npc) {

    if (Phaser.Math.distance(npc.x, npc.y, npc.origX, npc.origY) >= npc.dist) {
        npc.body.velocity.setTo(0, 0);
        npc.animations.stop('walk');
        npc.animations.play('idle');
        npc.frame = 3;
        game.time.events.add(1, moveNpc, this, npc, npc.myTerritory);


    }
};
