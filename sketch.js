let player1, player2;
let bullets = [];
let frameCounter = 0;
let backgroundImg;
let gameOver = false;
let winner = null;
let sprites = {
  player1: {
    idle: { img: null, width: 60, height: 60, frames: 5 },
    walk: { img: null, width: 42, height: 70, frames: 7},
    jump: { img: null, width: 57, height: 60, frames: 9 }
  },
  player2: {
    idle: { img: null, width: 40, height: 191, frames: 6 },
    walk: { img: null, width: 32, height: 180, frames: 6 },
    jump: { img: null, width: 38, height: 185, frames: 8 }
  },
  explosion: { img: null, width: 133, height: 100, frames: 4 },
  bullet: { img: null, width: 70, height: 46, frames: 8 }
};

function preload() {
  // 載入背景圖片，並加入詳細的錯誤訊息
  backgroundImg = loadImage('game_background.jpg', 
    () => {
      console.log('背景圖片載入成功！');
      console.log('背景圖片大小：', backgroundImg.width, 'x', backgroundImg.height);
    },
    (err) => {
      console.error('背景圖片載入失敗！');
      console.error('錯誤訊息：', err);
      console.error('請確認檔案 game_background.jpg 是否存在於正確位置');
    }
  );
  // 載入所有精靈圖並加入錯誤處理
  loadImage('idle.png', 
    img => {
      console.log('成功載入 idle.png');
      sprites.player1.idle.img = img;
    },
    err => console.log('載入 idle.png 失敗:', err)
  );
  
  loadImage('walk.png', 
    img => {
      console.log('成功載入 walk.png');
      sprites.player1.walk.img = img;
    },
    err => console.log('載入 walk.png 失敗:', err)
  );
  
  loadImage('jump.png', 
    img => {
      console.log('成功載入 jump.png');
      sprites.player1.jump.img = img;
    },
    err => console.log('載入 jump.png 失敗:', err)
  );
  
  loadImage('2idle.png', 
    img => {
      console.log('成功載入 2idle.png');
      sprites.player2.idle.img = img;
    },
    err => console.log('載入 2idle.png 失敗:', err)
  );
  
  loadImage('2walk.png', 
    img => {
      console.log('成功載入 2walk.png');
      sprites.player2.walk.img = img;
    },
    err => console.log('載入 2walk.png 失敗:', err)
  );
  
  loadImage('2jump.png', 
    img => {
      console.log('成功載入 2jump.png');
      sprites.player2.jump.img = img;
    },
    err => console.log('載入 2jump.png 失敗:', err)
  );
  
  loadImage('explosion.png', 
    img => {
      console.log('成功載入 explosion.png');
      sprites.explosion.img = img;
    },
    err => console.log('載入 explosion.png 失敗:', err)
  );
  
  loadImage('bullet.png', 
    img => {
      console.log('成功載入 bullet.png');
      sprites.bullet.img = img;
    },
    err => console.log('載入 bullet.png 失敗:', err)
  );
}

function setup() {
  // 改成全螢幕
  createCanvas(windowWidth, windowHeight);
  
  // 初始化玩家
  player1 = new Player(windowWidth * 0.1, windowHeight * 0.5, 'red', 87, 83, 65, 68, 32);
  player2 = new Player(windowWidth * 0.9, windowHeight * 0.5, 'blue', UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, SHIFT);
  
  // 調整角色大小
  player1.size = windowHeight * 0.15;
  player2.size = windowHeight * 0.15;
}

// 加在 setup 函數後面
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 重新調整玩家位置
  if (player1 && player2) {
    player1.x = windowWidth * 0.1;
    player1.y = windowHeight * 0.5;
    player2.x = windowWidth * 0.9;
    player2.y = windowHeight * 0.5;
    
    player1.size = windowHeight * 0.15;
    player2.size = windowHeight * 0.15;
  }
}



function draw() {
  background(220);
  frameCounter++;
  
  // Update and display players
  player1.update();
  player1.display();
  player2.update();
  player2.display();
  
  // Update and display bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    
    // Check bullet collisions with players
    if (bullets[i].hits(player1)) {
      player1.health -= 10;
      bullets.splice(i, 1);
    } else if (bullets[i].hits(player2)) {
      player2.health -= 10;
      bullets.splice(i, 1);
    }
    // Remove bullets that are off screen
    else if (bullets[i].isOffscreen()) {
      bullets.splice(i, 1);
    }
  }
}
class Player {
  constructor(x, y, color, upKey, downKey, leftKey, rightKey, shootKey) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 5;
    this.size = 100;
    this.health = 100;
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.shootKey = shootKey;
    this.shootCooldown = 0;
    this.currentState = 'idle';
    this.frameIndex = 0;
    this.facingRight = true;
    this.animationDelay = 0;
    this.isMoving = false;
    this.lastFrameIndex = 0;
  }
  
  update() {
    this.isMoving = false;
    
    if (keyIsDown(this.upKey)) {
      this.y -= this.speed;
      this.isMoving = true;
      this.currentState = 'jump';
    }
    if (keyIsDown(this.downKey)) {
      this.y += this.speed;
      this.isMoving = true;
      this.currentState = 'walk';
    }
    if (keyIsDown(this.leftKey)) {
      this.x -= this.speed;
      this.isMoving = true;
      this.facingRight = false;
      this.currentState = 'walk';
    }
    if (keyIsDown(this.rightKey)) {
      this.x += this.speed;
      this.isMoving = true;
      this.facingRight = true;
      this.currentState = 'walk';
    }
    
    if (!this.isMoving) {
      this.currentState = 'idle';
      this.frameIndex = 0;
    } else {
      this.animationDelay++;
      if (this.animationDelay >= 8) {
        this.animationDelay = 0;
        let spriteData = sprites[this.color === 'red' ? 'player1' : 'player2'][this.currentState];
        if (spriteData && spriteData.img && spriteData.img.width) {
          this.frameIndex = (this.frameIndex + 1) % spriteData.frames;
        }
      }
    }
    
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
    
    if (keyIsDown(this.shootKey) && this.shootCooldown <= 0) {
      let bulletX = this.x + (this.facingRight ? this.size * 0.75 : this.size * 0.25);
      let bulletY = this.y + this.size * 0.5;
      bullets.push(new Bullet(bulletX, bulletY, this.color));
      this.shootCooldown = 15;
    }
    this.shootCooldown--;
  }
  
  display() {
    push();
    let spriteData = sprites[this.color === 'red' ? 'player1' : 'player2'][this.currentState];
    
    if (!spriteData || !spriteData.img || !spriteData.img.width) {
      fill(this.color);
      rect(this.x, this.y, this.size, this.size);
      pop();
      return;
    }
    
    try {
      let frameX = this.frameIndex * spriteData.width;
      frameX = constrain(frameX, 0, spriteData.img.width - spriteData.width);
      
      if (!this.facingRight) {
        translate(this.x + this.size, this.y);
        scale(-1, 1);
      } else {
        translate(this.x, this.y);
      }
      
      image(spriteData.img, 
        0, 0, this.size, this.size,
        frameX, 0, spriteData.width, spriteData.height);
    } catch (error) {
      console.log('繪製精靈圖時發生錯誤:', error);
      fill(this.color);
      rect(0, 0, this.size, this.size);
    }
    
    pop();
    
    fill(0, 255, 0);
    rect(this.x, this.y - 10, this.size * (this.health/100), 5);
  }
}

class Bullet {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 15;
    this.size = 50;
    this.direction = (this.color === 'red') ? 1 : -1;  // 紅色向右，藍色向左
  }
  
  update() {
    this.x += this.speed * this.direction;
  }
  
  display() {
    push();
    fill(this.color);
    strokeWeight(2);
    stroke(255);
    circle(this.x, this.y, this.size);
    pop();
  }
  
  hits(player) {
    let bulletLeft = this.x - this.size/2;
    let bulletRight = this.x + this.size/2;
    let bulletTop = this.y - this.size/2;
    let bulletBottom = this.y + this.size/2;
    
    return !(bulletLeft > player.x + player.size || 
             bulletRight < player.x || 
             bulletTop > player.y + player.size ||
             bulletBottom < player.y);
  }
  
  isOffscreen() {
    return this.x < 0 || this.x > width;
  }
}

// 在 Player 類別中的發射部分
if (keyIsDown(this.shootKey) && this.shootCooldown <= 0) {
  let bulletX = this.x + (this.facingRight ? this.size : 0);
  let bulletY = this.y + this.size/2;
  
  if (this.color === 'blue') {
    // 藍色角色三發子彈
    bullets.push(new Bullet(bulletX, bulletY - 30, this.color));
    bullets.push(new Bullet(bulletX, bulletY, this.color));
    bullets.push(new Bullet(bulletX, bulletY + 30, this.color));
    this.shootCooldown = 30;
  } else {
    // 紅色角色單發
    bullets.push(new Bullet(bulletX, bulletY, this.color));
    this.shootCooldown = 15;
  }
}

function draw() {
  clear();
  
  // 繪製背景
  if (backgroundImg) {
    image(backgroundImg, 0, 0, width, height);
  } else {
    background(220);
  }

  // 檢查是否遊戲結束
  if (player1.health <= 0) {
    gameOver = true;
    winner = '卡比';
  } else if (player2.health <= 0) {
    gameOver = true;
    winner = '帝帝帝大王';
  }

  // 如果遊戲結束，顯示勝利畫面
  if (gameOver) {
    push();
    // 半透明黑色背景
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    // 勝利文字
    textSize(80);
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    strokeWeight(5);
    text(winner + '玩家獲勝！', width/2, height/2);
    
    // 重新開始提示
    textSize(30);
    text('按下 R 鍵重新開始', width/2, height/2 + 80);
    pop();
    
    // 檢查是否按下重新開始
    if (keyIsDown(82)) { // 82 是 R 鍵的 keyCode
      resetGame();
    }
    
    return; // 遊戲結束時不執行其他更新
  }

  // 原有的遊戲邏輯
  push();
  textSize(60);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0);
  strokeWeight(4);
  text('淡江教科', width/2, height/4);
  pop();
  
  // 操作說明文字
  push();
  textSize(16);
  textAlign(LEFT, TOP);
  fill(255);
  stroke(0);
  strokeWeight(2);
  
  // 紅色玩家操作說明
  text('帝帝帝大王：', 20, 20);
  text('W - 上', 20, 40);
  text('S - 下', 20, 60);
  text('A - 左', 20, 80);
  text('D - 右', 20, 100);
  text('空白鍵 - 發射', 20, 120);
  
  // 藍色玩家操作說明
  text('卡比：', 20, 160);
  text('↑ - 上', 20, 180);
  text('↓ - 下', 20, 200);
  text('← - 左', 20, 220);
  text('→ - 右', 20, 240);
  text('Shift - 發射', 20, 260);
  pop();
  
  // 更新和顯示玩家與子彈
  player1.update();
  player1.display();
  player2.update();
  player2.display();
  
  // 更新和顯示子彈
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    
    if (bullets[i].color === 'red') {
      if (bullets[i].hits(player2)) {
        player2.health -= 10;
        bullets.splice(i, 1);
        continue;
      }
    } else if (bullets[i].color === 'blue') {
      if (bullets[i].hits(player1)) {
        player1.health -= 10;
        bullets.splice(i, 1);
        continue;
      }
    }
    
    if (bullets[i].isOffscreen()) {
      bullets.splice(i, 1);
    }
  }
}

// 加在檔案最後面
function resetGame() {
  // 重置玩家
  player1 = new Player(100, 300, 'red', 87, 83, 65, 68, 32);
  player2 = new Player(600, 300, 'blue', UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, SHIFT);
  
  player1.size = 100;
  player2.size = 100;
  
  // 清空子彈
  bullets = [];
  
  // 重置遊戲狀態
  gameOver = false;
  winner = null;
}
