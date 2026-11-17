import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ACTIVE_LOCALES, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getAllPosts } from '@/lib/content';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProjectCard } from '@/components/content/ProjectCard';
import { href } from '@/lib/i18n/href';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: currentLang } = await props.params;
  const dictionary = await getDictionary();

  return {
    title: `${dictionary.projetos.title} — ${siteConfig.name}`,
    description: dictionary.projetos.description,
    alternates: {
      canonical: `/${currentLang}/projetos`,
    },
  };
}

export default async function ProjetosIndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await props.params;

  if (!isLocale(currentLang) || !ACTIVE_LOCALES.includes(currentLang as Locale)) {
    notFound();
  }

  const locale = currentLang as Locale;
  const dictionary = await getDictionary();
  const projects = await getAllPosts(locale, 'projetos');

  const breadcrumbs = [
    { label: dictionary.nav.home, href: href(locale, '/') },
    { label: dictionary.nav.projetos },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} prefixLabel={dictionary.breadcrumbs.prefix} />

      <header className="border-b border-border pb-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-fg">
          {dictionary.projetos.title}
        </h1>
        <p className="mt-1 font-mono text-sm text-muted">
          {dictionary.projetos.description}
        </p>
      </header>

      <section>
        {projects.length === 0 ? (
          <p className="font-mono text-sm text-muted">{dictionary.projetos.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.href}
                project={project}
                labels={dictionary.projetos}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
