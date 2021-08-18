const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageNames = ['tori', 'kinoko', 'saboten','moai'];
const onclickArea = document.getElementById('onclick-area');//buttonをタップするため



// グローバルな game オブジェクト
const game = {
    counter: 0,
    bgm: new Audio('bgm/jump.mp3'),
    enemys: [],
    image: {},
    isGameOver: true,
    score: 0,
    timer: null
};

// 複数画像読み込み
let imageLoadCounter = 0;
for (const imageName of imageNames) {
    const imagePath = `image/${imageName}.png`;
    game.image[imageName] = new Image();
    game.image[imageName].src = imagePath;
    game.image[imageName].onload = () => {
        imageLoadCounter += 1;
        if (imageLoadCounter === imageNames.length) {
            console.log('画像のロードが完了しました。');
            init();
        }
    }
}

function init() {
    game.counter    = 0;
    game.enemys     = [];
    game.isGameOver = false;
    game.score      = 0;
    createTori();
    game.timer = setInterval(ticker, 30);
}

function ticker() {
     // 画面クリア
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     // 敵キャラクターの生成
     if(Math.floor(Math.random() * 100) === 0) {
     //if(Math.floor(Math.random() * (100 - game.score / 100)) === 0) {難易度を高く
            createKinoko();
        }
       if(Math.floor(Math.random() * 200) === 0) {
    //if(Math.floor(Math.random() * (200 - game.score / 100)) === 0) {難易度を高く
           createMoai();
       }
       if(Math.floor(Math.random() * 300) === 0) {
        //if(Math.floor(Math.random() * (300 - game.score / 100)) === 0) {難易度を高く
               createSaboten();
           }
 
     // キャラクターの移動
     moveTori(); // 恐竜の移動
     moveEnemys(); // 敵キャラクターの移動
 
     //描画
     drawTori();// 恐竜の描画
     drawEnemys(); // 敵キャラクターの描画
     drawScore(); // スコアの描画
 
     // あたり判定
     hitCheck();
 
     // カウンターの更新
     game.score += 1;
     game.counter = (game.counter + 1) % 1000000;
    }

function createTori() {
    game.tori = {
        x: game.image.tori.width / 2,
        y: canvas.height - game.image.tori.height / 2,
        moveY: 0,
        width: game.image.tori.width,
        height: game.image.tori.height,
        image: game.image.tori
    }
}

function createKinoko() {
    game.enemys.push({
        x: canvas.width + game.image.kinoko.width / 2,
        y: canvas.height - game.image.kinoko.height / 2,
        width: game.image.kinoko.width,
        height: game.image.kinoko.height,
        moveX: -10,
        image: game.image.kinoko
    });
}

/*function createHato() {
    const hatoY = Math.random() * (300 - game.image.hato.height) + 150;
    game.enemys.push({
        x: canvas.width + game.image.hato.width / 2,
        y: hatoY,
        width: game.image.hato.width,
        height: game.image.hato.height,
        moveX: -5,
        image: game.image.hato
    });
}*/

function createMoai() {
    game.enemys.push({
        x: canvas.width + game.image.moai.width / 2,
        y: canvas.height - game.image.moai.height / 2,
        width: game.image.moai.width,
        height: game.image.moai.height,
        moveX: -10,
        image: game.image.moai
    });
}

function createSaboten() {
    game.enemys.push({
        x: canvas.width + game.image.saboten.width / 2,
        y: canvas.height - game.image.saboten.height / 2,
        width: game.image.saboten.width,
        height: game.image.saboten.height,
        moveX: -10,
        image: game.image.saboten
    });
}

function moveTori() {
    game.tori.y += game.tori.moveY;
    if (game.tori.y >= canvas.height - game.tori.height / 2) {
        game.tori.y = canvas.height - game.tori.height / 2;
        game.tori.moveY = 0;
    } else {
        game.tori.moveY += 3;
    }
}

function moveEnemys() {
    for (const enemy of game.enemys) {
        enemy.x += enemy.moveX;
    }
    // 画面の外に出たキャラクターを配列から削除
    game.enemys = game.enemys.filter(enemy => enemy.x > -enemy.width);
}

function drawTori() {
    ctx.drawImage(game.image.tori, game.tori.x - game.tori.width / 2, game.tori.y - game.tori.height / 2);
}

function drawEnemys() {
    for (const enemy of game.enemys) {
        ctx.drawImage(enemy.image, enemy.x - enemy.width / 2, enemy.y - enemy.height / 2);
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '38px Helvetica, Arial, sans-serif ';
    ctx.fillText(`score: ${game.score}`, 0, 30);
}

function hitCheck() {
    for (const enemy of game.enemys) {
        if (//少しぐらいかすってもOKなくらい、甘い設定
            //Math.abs(game.tori.x - enemy.x) < game.tori.width / 2 + enemy.width / 2 &&
            Math.abs(game.tori.x - enemy.x) < game.tori.width * 0.5 / 2 + enemy.width * 0.5 / 2 &&
            //Math.abs(game.tori.y - enemy.y) < game.tori.height / 2 + enemy.height / 2
            Math.abs(game.tori.y - enemy.y) < game.tori.height * 0.5 / 2 + enemy.height * 0.5 / 2
        ) {
            game.isGameOver = true;
            ctx.font = '45px Helvetica, Arial, sans-serif ';
            ctx.fillText(`＼リロードで再スタート／`, 150, 200);
            clearInterval(game.timer);
        }
    }
}

document.onkeydown = function(e) {
    /*if(e.key ===' '&& game.state === 'init'){
        StaticRange();
    }*/
    //if(e.key === ' ' && game.tori.moveY === 0) {
    if (e.key ===' '){
        game.tori.moveY = -20;
    }
    if(e.key === 'Enter' && game.isGameOver === true) {
              init();
    }
};

document.body.onclick = function(){
    if(onclickArea === 'touched' && game.isGameObr === true){
        init();
    }
    else{
    game.tori.moveY = -20;
    }
}




