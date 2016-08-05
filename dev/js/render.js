/*
 現在の盤面の状態を描画する処理
 */
var canvas = document.getElementsByTagName('canvas')[0],  // キャンバス
  ctx = canvas.getContext('2d'), // コンテクスト
  W = 300,
  H = 600,
  BLOCK_W = W / COLS,
  BLOCK_H = H / ROWS,  // マスの幅を設定
  x,
  y;

// x, yの部分へマスを描画する処理
function drawBlock(x, y) {
  ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
  ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

// 盤面と操作ブロックを描画する
function render() {
  ctx.clearRect(0, 0, W, H);  // 一度キャンバスを真っさらにする
  ctx.strokeStyle = 'black';  // えんぴつの色を黒にする

  // 盤面を描画する
  for (x = 0; x < COLS; ++x) {
    for (y = 0; y < ROWS; ++y) {
      if (board[y][x]) {  // マスが空、つまり0ではなかったら
        ctx.fillStyle = colors[board[y][x] - 1];  // マスの種類に合わせて塗りつぶす色を設定
        drawBlock(x, y);  // マスを描画
      }
    }
  }

  // 操作ブロックを描画する
  for (y = 0; y < 4; ++y) {
    for (x = 0; x < 4; ++x) {
      if (current[y][x]) {
        ctx.fillStyle = colors[current[y][x] - 1];  // マスの種類に合わせて塗りつぶす色を設定
        drawBlock(currentX + x, currentY + y);  // マスを描画
      }
    }
  }
}

// 30ミリ秒ごとに状態を描画する関数を呼び出す
setInterval(render, 30);
