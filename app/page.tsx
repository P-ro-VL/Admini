import { getStorage } from '@/lib/storage';
import ClientPageWrapper from '@/components/published/ClientPageWrapper';
import { PageConfig } from '@/lib/types';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getStorage();
  return {
    title: settings.appTitle || 'Home',
    icons: settings.appIcon ? { icon: settings.appIcon } : undefined,
  };
}

export default async function Home() {
  const { pages, apis, sidebar, settings } = await getStorage();

  const emptyPage: PageConfig = {
    id: 'home',
    slug: '',
    name: '',
    components: []
  };

  return (
    <ClientPageWrapper
      page={emptyPage}
      pages={pages}
      apis={apis}
      sidebar={sidebar}
      settings={settings}
      params={{}}
    />
  );
}
