import DownloadsClient from './DownloadsClient';

export const metadata = {
    title: 'Downloads - MetFlix',
    description: 'Manage your downloaded movies and series.',
};

export default function DownloadsPage() {
    return <DownloadsClient />;
}
