import './game/style.css';
import { sound } from './sound.ts';
import './game/app.js';

// Setup audio and PWA integrations once DOM is ready
function setupAppFeatures() {
  const soundBtn = document.getElementById('soundBtn');
  const installBtn = document.getElementById('installBtn');
  const iosGuide = document.getElementById('iosInstallGuide') as HTMLDialogElement | null;
  const closeIosGuide = document.getElementById('closeIosGuide');

  // Sound toggle button
  if (soundBtn) {
    const updateSoundLabel = () => {
      soundBtn.textContent = sound.isMuted() ? '🔇' : '🔊';
      soundBtn.title = sound.isMuted() ? '音声をオンにする' : '音声をミュートする';
    };
    updateSoundLabel();
    soundBtn.addEventListener('click', () => {
      sound.toggleMute();
      updateSoundLabel();
    });
  }

  // PWA Install prompt
  let deferredPrompt: any = null;
  const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  if (installBtn && !isStandalone) {
    if (isIOS) {
      installBtn.style.display = 'inline-block';
      installBtn.textContent = '📲 アプリ保存';
      installBtn.onclick = () => {
        sound.playClick();
        iosGuide?.showModal();
      };
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.style.display = 'inline-block';
      installBtn.textContent = '📲 アプリ保存';
      installBtn.onclick = async () => {
        sound.playClick();
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            installBtn.style.display = 'none';
          }
          deferredPrompt = null;
        }
      };
    });

    window.addEventListener('appinstalled', () => {
      installBtn.style.display = 'none';
      deferredPrompt = null;
    });
  }

  if (closeIosGuide && iosGuide) {
    closeIosGuide.onclick = () => {
      sound.playClick();
      iosGuide.close();
    };
  }

  // Hook button clicks for tactile sound feedback
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const btn = target.closest('button, [data-mode], [data-tab], [data-pick], [data-extra-move], [data-move]');
    if (btn && btn.id !== 'soundBtn') {
      sound.playClick();
    }
  });

  // Watch battle logs for dynamic sound effects (Black Flash, Domain, Slash, Charge, Heal, etc.)
  let lastLogCount = 0;
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const observer = new MutationObserver(() => {
      const logItems = document.querySelectorAll('.logitem');
      if (logItems.length > lastLogCount) {
        lastLogCount = logItems.length;
        const latest = logItems[0]?.textContent || '';

        if (latest.includes('黒閃')) {
          sound.playBlackFlash();
        } else if (
          latest.includes('無量空処') ||
          latest.includes('伏魔御厨子') ||
          latest.includes('自閉円頓裹') ||
          latest.includes('誅伏賜死') ||
          latest.includes('領域')
        ) {
          sound.playDomain();
        } else if (latest.includes('紫') || latest.includes('虚式')) {
          sound.playPurple();
        } else if (latest.includes('反転術式') || latest.includes('回復')) {
          sound.playHeal();
        } else if (latest.includes('解') || latest.includes('捌') || latest.includes('世界を断つ斬撃') || latest.includes('抜刀')) {
          sound.playSlash();
        } else if (latest.includes('チャージ') || latest.includes('百斂')) {
          sound.playCharge();
        } else if (
          latest.includes('パンチ') ||
          latest.includes('ダメージ') ||
          latest.includes('攻撃') ||
          latest.includes('穿血') ||
          latest.includes('多重魂')
        ) {
          sound.playHit();
        } else {
          sound.playClap();
        }
      } else if (logItems.length === 0) {
        lastLogCount = 0;
      }
    });

    observer.observe(appContainer, { childList: true, subtree: true });
  }

  // Register service worker for offline support
  if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAppFeatures);
} else {
  setupAppFeatures();
}
