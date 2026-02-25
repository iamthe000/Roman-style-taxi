// ゲーム設定
const taxi = document.getElementById('taxi');
const road = document.getElementById('road');
const stopLine = document.getElementById('stop-line');
const scoreDisplay = document.getElementById('social-credit');
const popUpChar = document.getElementById('pop-up-char');
const messageEl = document.getElementById('message');

let score = 0;
let positionY = -20; // タクシーの初期位置 (%)
let isMoving = true;
let animationId;
let currentSpeed = 0; // タクシーの現在の速度

// ゲームループ
function gameLoop() {
    if (!isMoving) return;

    positionY += currentSpeed;

    if (positionY > 120) {
        // 通り過ぎた場合（失敗）
        resetTaxi();
    } else {
        taxi.style.top = positionY + '%';
        animationId = requestAnimationFrame(gameLoop);
    }
}

// タクシーのリセット
function resetTaxi() {
    positionY = -20;
    taxi.style.top = positionY + '%';
    hideCharacter();

    // 速度をランダムに設定 (1.0 ~ 2.0 %/frame の範囲に修正)
    currentSpeed = Math.random() + 1.0; 

    // 動き再開
    isMoving = true;
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
}

// 挙手ボタンの処理
function checkTiming() {
    if (!isMoving) {
        // 停止中なら何もしない
        return;
    }

    // 厳密なピクセル計算
    const taxiRect = taxi.getBoundingClientRect();
    const lineRect = stopLine.getBoundingClientRect();
    const roadRect = road.getBoundingClientRect();

    // 判定基準
    const taxiTop = taxiRect.top;
    const taxiBottom = taxiRect.bottom;
    const lineTop = lineRect.top;
    const lineBottom = lineRect.bottom;

    // 許容範囲 (px) - これを狭くすると難しくなる
    const tolerance = 10; 

    // 成功条件: タクシーが停止線に重なっている
    if (taxiBottom > lineTop && taxiTop < lineBottom) {
        success();
    } else {
        // 失敗...
        fail();
    }
}

function success() {
    isMoving = false;
    cancelAnimationFrame(animationId);

    score++;
    scoreDisplay.textContent = score;

    messageEl.textContent = "好機!!";
    messageEl.style.display = 'block';

    showCharacter();

    setTimeout(() => {
         messageEl.style.display = 'none'; // メッセージを消す
         resetTaxi();
    }, 500);
}

function fail() {
    score--;
    scoreDisplay.textContent = score;

    messageEl.textContent = "失敗";
    messageEl.style.color = 'white';
    messageEl.style.textShadow = '2px 2px black';
    messageEl.style.display = 'block';

    taxi.style.backgroundColor = 'red';

    setTimeout(() => {
        messageEl.style.display = 'none';
        messageEl.style.color = 'red';
        messageEl.style.textShadow = '2px 2px white';
        taxi.style.backgroundColor = '#FFD700';

        resetTaxi();
    }, 300); // 失敗メッセージは少し短く表示
}

function showCharacter() {

    popUpChar.style.right = '0px';
}

function hideCharacter() {

    popUpChar.style.right = '-200px';
}

// イベントリスナー
const gameContainer = document.getElementById('game-container');
gameContainer.addEventListener('touchstart', (e) => {
    e.preventDefault(); // デフォルトのズームなどを防止
    checkTiming();
}, { passive: false }); // passive: falseを追加してpreventDefaultを有効にする

gameContainer.addEventListener('mousedown', checkTiming);

// スタート
resetTaxi();
