import { appWindow } from '@tauri-apps/api/window'
import { useEffect } from 'react';

export default function useTitlebar() {
    useEffect(() => {
        const minimize = () => appWindow.minimize();
        const maximize = () => appWindow.maximize();
        const close = () => appWindow.close();

        document
            .getElementById('titlebar-minimize')?.addEventListener('click', minimize)
        document
            .getElementById('titlebar-maximize')?.addEventListener('click', maximize)
        document
            .getElementById('titlebar-close')?.addEventListener('click', close)

        return () => {
            document.removeEventListener('click', minimize);
            document.removeEventListener('click', maximize);
            document.removeEventListener('click', close);
        }
    }, [])
}