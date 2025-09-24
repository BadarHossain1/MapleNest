import { NewProjectDetailsClient } from '@/components/NewProjectDetailsClient';

interface NewProjectPageProps {
    params: {
        slug: string;
    };
}

// Required for Next.js static export when using dynamic routes
export async function generateStaticParams() {
    const slugs = [
        'skyview-condos-toronto',
        'liberty-towers-toronto',
        'harbourfront-residences-toronto',
        'yorkville-heights-toronto',
        'pacific-view-vancouver',
        'mountain-ridge-vancouver',
        'olympic-village-vancouver',
        'west-end-towers-vancouver',
        'plateau-lofts-montreal',
        'old-port-condos-montreal',
        'downtown-suites-montreal',
        'griffintown-towers-montreal',
        'bow-river-residences-calgary',
        'downtown-core-calgary',
        'kensington-heights-calgary',
        'mission-district-calgary',
        'byward-market-condos-ottawa',
        'rideau-centre-ottawa',
        'westboro-village-ottawa',
        'waterfront-district-halifax',
        'downtown-halifax-towers'
    ];

    return slugs.map((slug) => ({ slug }));
}

export default function NewProjectPage({ params }: NewProjectPageProps) {
    return <NewProjectDetailsClient slug={params.slug} />;
}