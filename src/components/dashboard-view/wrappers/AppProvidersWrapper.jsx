'use client';

// SessionProvider removed - using custom JWT auth with Go backend
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TitleProvider } from '@/components/dashboard-view/context/useTitleContext';
import { NotificationProvider } from '@/components/dashboard-view/context/useNotificationContext';
const LayoutProvider = dynamic(() => import('@/components/dashboard-view/context/useLayoutContext').then(mod => mod.LayoutProvider), {
  ssr: false
});
const AppProvidersWrapper = ({
  children
}) => {
  useEffect(() => {
    console.log('[AppProvidersWrapper] Mounted/Updated', new Date().toISOString());
    const splashElement = document.querySelector('#__next_splash');
    const splashScreen = document.querySelector('#splash-screen');
    if (!splashElement || !splashScreen) return;
    const handleMutations = mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && splashElement.hasChildNodes()) {
          splashScreen.classList.add('remove');
        }
      }
    };
    const observer = new MutationObserver(handleMutations);
    observer.observe(splashElement, {
      childList: true,
      subtree: true
    });
    if (splashElement.hasChildNodes()) {
      splashScreen.classList.add('remove');
    }
    return () => observer.disconnect();
  }, []);
  return (
    <LayoutProvider>
      <TitleProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </TitleProvider>
    </LayoutProvider>
  );
};
export default AppProvidersWrapper;