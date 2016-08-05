var COLS = 10,
  ROWS = 20,  // 横10、縦20マス
  board = [],  // 盤面情報
  lose,  // 一番上までいっちゃったかどうか
  interval,  // ゲームを実行するタイマーを保持する変数
  current, // 今操作しているブロックの形
  currentX,
  currentY, // 今操作しているブロックの位置
  timer = 30,
  next_time = 30,
  timer_interval,
  score = 0,
  next_score = 0,

// 操作するブロックのパターン
  shapes = [
    [1, 1, 1, 1],
    [1, 1, 1, 0,
      1],
    [1, 1, 1, 0,
      0, 0, 1],
    [1, 1, 0, 0,
      1, 1],
    [1, 1, 0, 0,
      0, 1, 1],
    [0, 1, 1, 0,
      1, 1],
    [0, 1, 0, 0,
      1, 1, 1]
  ],

// ブロックの色
  colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
  ],

  x,
  y;

// 盤面をリセットする関数
function init() {
  for (var y = 0; y < ROWS; ++y) {
    board[y] = [];
    for (var x = 0; x < COLS; ++x) {
      board[y][x] = 0;
    }
  }
}

// shapesからランダムにブロックのパターンを出力し、盤面の一番上へセットする
function newShape() {
  var id = Math.floor(Math.random() * shapes.length);  // ランダムにインデックスを出す
  var shape = shapes[id];
  // パターンを操作ブロックへセットする
  current = [];
  for (var y = 0; y < 4; ++y) {
    current[y] = [];
    for (var x = 0; x < 4; ++x) {
      var i = 4 * y + x;
      if (typeof shape[i] != 'undefined' && shape[i]) {
        current[y][x] = id + 1;
      }
      else {
        current[y][x] = 0;
      }
    }
  }
  // ブロックを盤面の上のほうにセットする
  currentX = 5;
  currentY = 0;
}

// メイン処理
function tick() {
  // １つ下へ移動する
  if (valid(0, 1)) {
    ++currentY;
  }
  // もし着地していたら(１つしたにブロックがあったら)
  else {
    freeze();  // 操作ブロックを盤面へ固定する
    clearLines();  // ライン消去処理
    if (lose) {
      // もしゲームオーバなら最初から始める
      timer = next_timer;
      score = next_score;
      newGame();
      return false;
    }
    // 新しい操作ブロックをセットする
    newShape();
  }
}

// 指定された方向に、操作ブロックを動かせるかどうかチェックする
// ゲームオーバー判定もここで行う
function valid(offsetX, offsetY, newCurrent) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (newCurrent[y][x]) {
        if (typeof board[y + offsetY] == 'undefined'
          || typeof board[y + offsetY][x + offsetX] == 'undefined'
          || board[y + offsetY][x + offsetX]
          || x + offsetX < 0
          || y + offsetY >= ROWS
          || x + offsetX >= COLS) {
          if (offsetY == 1 && offsetX - currentX == 0 && offsetY - currentY == 1) {
           // console.log('game over');
            lose = true; // もし操作ブロックが盤面の上にあったらゲームオーバーにする
          }
          return false;
        }
      }
    }
  }
  return true;
}

// 操作ブロックを盤面にセットする関数
function freeze() {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current[y][x]) {
        board[y + currentY][x + currentX] = current[y][x];
      }
    }
  }
}

// 一行が揃っているか調べ、揃っていたらそれらを消す
function clearLines() {
  for (y = ROWS - 1; y >= 0; --y) {
    var rowFilled = true;
    // 一行が揃っているか調べる
    for (x = 0; x < COLS; ++x) {
      if (board[y][x] == 0) {
        rowFilled = false;
        break;
      }
    }
    // もし一行揃っていたら, サウンドを鳴らしてそれらを消す。
    if (rowFilled) {
      //document.getElementById('clearsound').play();  // 消滅サウンドを鳴らす
      // その上にあったブロックを一つずつ落としていく
      for (var yy = y; yy > 0; --yy) {
        for (var x = 0; x < COLS; ++x) {
          board[yy][x] = board[yy - 1][x];
        }
      }
      score = score + 100;
      timer = timer + 5;
      ++y;  // 一行落としたのでチェック処理を一つ下へ送る
    }
  }
}

function get_score(){
  var elm = document.getElementById("score"); 
  elm.innerHTML = score;
}

// キーボードが押された時に呼び出される関数
function keyPress(key) {
  switch (key) {
    case 'left':
      if (valid(-1)) {
        --currentX;  // 左に一つずらす
      }
      break;
    case 'right':
      if (valid(1)) {
        ++currentX;  // 右に一つずらす
      }
      break;
    case 'down':
      if (valid(0, 1)) {
        ++currentY;  // 下に一つずらす
      }
      break;
    case 'rotate':
      // 操作ブロックを回す
      var rotated = rotate(current);
      if (valid(0, 0, rotated)) {
        current = rotated;  // 回せる場合は回したあとの状態に操作ブロックをセットする
      }
      break;
  }
}

// 操作ブロックを回す処理
function rotate(current) {
  var newCurrent = [];
  for (var y = 0; y < 4; ++y) {
    newCurrent[y] = [];
    for (var x = 0; x < 4; ++x) {
      newCurrent[y][x] = current[3 - x][y];
    }
  }
  return newCurrent;
}

function limit(){
   if (lose) {
      // もしゲームオーバなら最初から始める
      timer = next_time;
      score = next_score;
      newGame();
      return false;
   }
 timer -= 1;
  var elm = document.getElementById("timer");
  elm.innerHTML = timer;
  if(timer<=0){
    lose = true; 
  } 
}



// ゲーム開始時の関数
function newGame() {
  clearInterval(interval);  // ゲームタイマーをクリア
  clearInterval(timer_interval);
  clearInterval(score);
  init();  // 盤面リセット
  // 30ミリ秒ごとに状態を描画する関数を呼び出す
  setInterval(render, 30);
  newShape();  // 操作ブロックをセット
  lose = false;  // 負けフラグリセット
  interval = setInterval(tick, 250);  // 250ミリ秒ごとにtickという関数を呼び出す
  timer_interval = setInterval(limit, 1000);  
  score_interval = setInterval(get_score,0);
}

