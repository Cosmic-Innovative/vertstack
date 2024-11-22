import { registerSW } from 'virtual:pwa-register';

export function registerPWA() {
  if ('serviceWorker' in navigator) {
    let updateSWCallback: ((reloadPage?: boolean) => Promise<void>) | undefined;

    const cleanup = () => {
      if (updateSWCallback) {
        // Clean up any pending updates
        updateSWCallback(false).catch(console.error);
      }
    };

    // Use pagehide for cleanup
    window.addEventListener('pagehide', cleanup, { capture: true });

    updateSWCallback = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('New content available, please refresh.');
        // Use a more modern approach than confirm()
        const userWantsUpdate = window.confirm(
          'New content available. Reload?',
        );
        if (userWantsUpdate) {
          updateSWCallback?.(true).catch(console.error);
        }
      },
      onOfflineReady() {
        console.log('Application ready to work offline');
      },
      onRegistered(swRegistration) {
        if (swRegistration) {
          // Add cleanup for service worker
          window.addEventListener(
            'pagehide',
            () => {
              swRegistration.update().catch(console.error);
            },
            { capture: true },
          );
        }
        console.log('Service Worker registered:', swRegistration);
      },
      onRegisterError(error) {
        console.error('Service Worker registration failed:', error);
      },
    });
  }
}
