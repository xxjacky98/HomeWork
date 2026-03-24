//==========全域變數設定==========
const totalTime = 180;//總倒數時間：3分鐘= 180秒
let remainingTime = totalTime;

const countdownEl = document.getElementById('countdown');
const progressFill = document.getElementById('progressFill');
const progressSteps = document.getElementById('progressSteps').children;
const guaranteeCards = document.querySelectorAll('.guarantee-card');

// ========== 三張卡片隨機放大核心功能（必須新增） ==========
function startCardRandomZoom() {
    // 每6秒隨機挑一張卡片執行放大動畫，數字越小觸發越頻繁
    setInterval(() => {
        // 隨機選取0~2的索引，對應三張卡片
        const randomCardIndex = Math.floor(Math.random() * guaranteeCards.length);
        const targetCard = guaranteeCards[randomCardIndex];

        // 先移除所有卡片的放大class，避免動畫重疊出錯
        guaranteeCards.forEach(card => {
            card.classList.remove('card-zoom-active');
        });

        // 替目標卡片加上放大動畫class
        targetCard.classList.add('card-zoom-active');

        // 動畫結束後移除class，供下次觸發
        setTimeout(() => {
            targetCard.classList.remove('card-zoom-active');
        }, 1200); // 時長和CSS裡的動畫設定一致
    }, 6000); // 每6秒觸發一次
}

// ========== 頁面載入初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
    // 1. 三張卡片載入時，隨機延遲彈出開場動畫（必須新增）
    guaranteeCards.forEach((card, index) => {
        const randomDelay = Math.random() * 0.6;
        setTimeout(() => {
            card.classList.add('loaded');
        }, randomDelay * 1000);
    });

    // 2. 啟動三張卡片持續隨機放大功能（核心，必須新增）
    startCardRandomZoom();

    // 3. 初始化戳泡泡遊戲（原本就有的，完全不用改）
    initBubbleGame();

    // 4. 啟動倒數計時與進度更新（原本就有的，完全不用改）
    startCountdown();
});

//==========2.倒數計時與進度更新（每5秒自動更新）
function startCountdown() {
    //先更新一次初始狀態
    updateProgress();
    
    //每5秒執行一次更新
    const updateInterval = setInterval(() => {
        remainingTime -= 5;
        updateProgress();

        //倒數結束，跳轉到台鐵官網
        if (remainingTime <= 0) {
            clearInterval(updateInterval);
            alert('系統已恢復正常！即將跳轉回台鐵訂票頁面...');
            window.location.href = 'https://www.railway.gov.tw/tra-tip-web/tip';
        }
    }, 5000); //每5秒更新一次
}

//==========進度更新邏輯==========
function updateProgress() {
    //更新倒數分鐘顯示
    const showMinutes = Math.ceil(remainingTime / 60);
    countdownEl.textContent = showMinutes;

    //更新進度條百分比
    const progressPercent = ((totalTime - remainingTime) / totalTime) * 100;
    progressFill.style.width = progressPercent + '%';

    //更新進度步驟狀態
    if (remainingTime <= 120) {
        //剩餘2分鐘內，完成第一步
        progressSteps[1].classList.remove('in-progress');
        progressSteps[1].classList.add('completed');
        progressSteps[2].classList.remove('pending');
        progressSteps[2].classList.add('in-progress');
    }
    if (remainingTime <= 0) {
        //倒數結束，完成所有步驟
        progressSteps[2].classList.remove('in-progress');
        progressSteps[2].classList.add('completed');
    }
}

// ==========3.戳泡泡遊戲邏輯 ======================================================================
function initBubbleGame() {
    const bubbles = document.querySelectorAll('.bubble');
    if (!bubbles.length) return;

    let audioCtx;
    const getAudioCtx = () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    };

    const playPop = () => {
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = 420;
            gain.gain.value = 0.06;
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.stop(ctx.currentTime + 0.09);
        } catch (e) {}
    };

    const playCheer = () => {
        try {
            const ctx = getAudioCtx();
            const master = ctx.createGain();
            master.gain.value = 0.12;
            master.connect(ctx.destination);

            const freqs = [440, 660, 880, 990];
            freqs.forEach((f, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = f;
                g.gain.value = 0.06 - i * 0.01;
                osc.connect(g); g.connect(master);
                osc.start();
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                osc.stop(ctx.currentTime + 0.45);
            });

            const sweep = ctx.createOscillator();
            const sg = ctx.createGain();
            sweep.type = 'sine';
            sweep.frequency.setValueAtTime(500, ctx.currentTime);
            sweep.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);
            sg.gain.value = 0.04;
            sweep.connect(sg); sg.connect(master);
            sweep.start();
            sg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            sweep.stop(ctx.currentTime + 0.32);

            const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const ng = ctx.createGain();
            ng.gain.value = 0.05;
            noise.connect(ng); ng.connect(master);
            noise.start();
            ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        } catch (e) {}
    };

    const spawnConfetti = (x, y) => {
        const colors = ['#FFB3C1','#FFD6A5','#CDEAC0','#BDE0FE','#FFC8DD'];
        for (let i = 0; i < 90; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti';
            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;
            const dx = (Math.random() * 220 + 60) * (x < window.innerWidth / 2 ? 1 : -1);
            const dy = -(Math.random() * 140 + 30);
            piece.style.setProperty('--dx', `${dx}px`);
            piece.style.setProperty('--dy', `${dy}px`);
            piece.style.background = colors[i % colors.length];
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 1100);
        }
    };

    const resetBtn = document.getElementById('bubble-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.bubble').forEach(el => {
                el.classList.remove('popped', 'pop-anim');
            });
            const msg = document.getElementById('bubble-complete');
            if (msg) msg.textContent = '';
        });
    }

    bubbles.forEach(b => b.addEventListener('click', () => {
        b.classList.toggle('popped');
        b.classList.remove('pop-anim');
        void b.offsetWidth;
        b.classList.add('pop-anim');
        playPop();

        const allPopped = [...document.querySelectorAll('.bubble')].every(el =>
            el.classList.contains('popped'));
        if (allPopped) {
            const card = document.querySelector('#bubble .bubble-card');
            const rect = card ? card.getBoundingClientRect() : null;
            const midY = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.6;
            const leftX = rect ? rect.left + 16 : 40;
            const rightX = rect ? rect.right - 16 : window.innerWidth - 40;
            spawnConfetti(leftX, midY);
            spawnConfetti(rightX, midY);
            playCheer();
            const msg = document.getElementById('bubble-complete');
            if (msg) {
                msg.textContent = '恭喜，你完成了！';
                msg.classList.remove('pop-anim');
                void msg.offsetWidth;
                msg.classList.add('pop-anim');
            }
        }
    }));
}