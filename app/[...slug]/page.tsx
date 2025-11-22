import { notFound } from 'next/navigation';
import { getStorage } from '@/lib/storage';
import ClientPageWrapper from '@/components/published/ClientPageWrapper';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { pages, settings } = await getStorage();
    const { slug: slugArray } = await params;
    const slug = slugArray.join('/');

    // Find page with dynamic route matching
    let page: any = null;

    // Sort pages by specificity (static routes first, then dynamic)
    const sortedPages = [...pages].sort((a, b) => {
        const aIsDynamic = a.slug.includes(':');
        const bIsDynamic = b.slug.includes(':');
        if (aIsDynamic && !bIsDynamic) return 1;
        if (!aIsDynamic && bIsDynamic) return -1;
        return 0;
    });

    for (const p of sortedPages) {
        // Convert defined slug to regex
        const regexPath = p.slug.replace(/:([^/]+)/g, '([^/]+)');
        const regex = new RegExp(`^${regexPath}$`);
        if (slug.match(regex)) {
            page = p;
            break;
        }
    }

    if (!page) {
        return {
            title: settings.appTitle || 'Page Not Found',
            icons: settings.appIcon ? { icon: settings.appIcon } : undefined,
        };
    }

    return {
        title: settings.appTitle || page.name,
        icons: settings.appIcon ? { icon: settings.appIcon } : undefined,
    };
}

export default async function PublicPage({ params }: PageProps) {
    const { pages, apis, sidebar, settings } = await getStorage();
    const { slug: slugArray } = await params;
    const slug = slugArray.join('/');

    // Find page with dynamic route matching
    let page: any = null;
    let routeParams: Record<string, string> = {};

    // Sort pages by specificity (static routes first, then dynamic)
    const sortedPages = [...pages].sort((a, b) => {
        const aIsDynamic = a.slug.includes(':');
        const bIsDynamic = b.slug.includes(':');
        if (aIsDynamic && !bIsDynamic) return 1;
        if (!aIsDynamic && bIsDynamic) return -1;
        return 0;
    });

    for (const p of sortedPages) {
        // Convert defined slug to regex
        const paramNames: string[] = [];
        const regexPath = p.slug.replace(/:([^/]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });

        const regex = new RegExp(`^${regexPath}$`);
        const match = slug.match(regex);

        if (match) {
            page = p;
            // Extract param values
            match.slice(1).forEach((value, index) => {
                routeParams[paramNames[index]] = value;
            });
            break;
        }
    }

    if (!page) {
        notFound();
    }

    return (
        <ClientPageWrapper
            page={page}
            pages={pages}
            apis={apis}
            sidebar={sidebar}
            settings={settings}
            params={routeParams}
        />
    );
}
