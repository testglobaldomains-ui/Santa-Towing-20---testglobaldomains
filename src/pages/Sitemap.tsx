import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useContent } from '@/hooks/useContent';
import { 
  Map, 
  Home, 
  Wrench, 
  Car, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  FolderTree
} from 'lucide-react';
import { SITEMAP_DATA } from '../data/sitemapData';

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  Wrench,
  Car,
  BookOpen,
  ShieldCheck,
  Map
};

export default function Sitemap() {
  const seoTitle = useContent('seo.sitemap.title', 'Website Sitemap | Santa Towing Ghana');
  const seoDesc = useContent('seo.sitemap.description', 'Comprehensive website directory of Santa Towing Ghana. Access all pages across our structured categories.');

  const numberedData = React.useMemo(() => {
    let counter = 1;
    return SITEMAP_DATA.map(category => ({
      ...category,
      links: category.links.map(link => ({
        ...link,
        number: counter++
      }))
    }));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO 
        title={seoTitle} 
        description={seoDesc} 
        canonical="/sitemap" 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Website Sitemap' }]} />
        </div>

        {/* Hero Header Section */}
        <div className="bg-white rounded-[1px] p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 shadow-md shadow-accent/20">
                  <FolderTree className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Website Sitemap
                </h1>
              </div>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-2">
                A complete architectural overview of Santa Towing. Navigate directly to any core service, inventory page, legal policy, or coverage route.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Listing */}
        <div className="space-y-8">
          {numberedData.map((category, index) => {
            const IconComponent = ICON_MAP[category.iconName] || Map;

            // Check if the first link acts as a structural parent for the group
            const firstLink = category.links[0];
            const hasParentChild = firstLink && (
              firstLink.label.includes('Overview') || 
              firstLink.label.includes('Directory')
            );

            const parentLink = hasParentChild ? firstLink : null;
            const childLinks = hasParentChild ? category.links.slice(1) : category.links;

            return (
              <section
                key={category.title + index}
                className="bg-white rounded-[1px] border border-slate-200/90 shadow-sm overflow-hidden"
              >
                <div className="p-5 sm:p-7 bg-slate-50/70 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {category.title}
                  </h2>
                </div>

                <div className="p-5 sm:p-8">
                  {hasParentChild && parentLink ? (
                    <div>
                      <Link
                        to={parentLink.path}
                        className="group inline-flex items-center gap-2 font-bold text-lg text-slate-900 hover:text-accent transition-colors"
                      >
                        <span className="text-slate-500 mr-1">{parentLink.number}.</span> {parentLink.label}
                        <ChevronRight className="w-5 h-5 text-accent opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      </Link>
                      
                      <div className="mt-4 ml-4 sm:ml-8 pl-4 border-l-2 border-slate-100">
                        <ul className={`grid grid-cols-1 ${
                          childLinks.length > 10 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
                        } gap-4`}>
                          {childLinks.map((link) => (
                            <li key={link.path}>
                              <Link
                                to={link.path}
                                className="group flex items-start gap-2 py-2 text-sm font-medium text-slate-600 hover:text-accent transition-colors"
                              >
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-accent mt-0.5 shrink-0" />
                                <div>
                                  <span className="block leading-snug">
                                    <span className="text-slate-400 font-bold mr-1">{link.number}.</span>
                                    {link.label}
                                  </span>
                                  <span className="text-xs text-slate-400 block mt-0.5 font-mono group-hover:text-accent/70 transition-colors break-all">
                                    {link.path}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <ul className={`grid grid-cols-1 ${
                      childLinks.length > 10 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'
                    } gap-4`}>
                      {childLinks.map((link) => (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            className="group flex items-start gap-2 p-4 rounded-[1px] bg-slate-50 border border-slate-100 hover:border-accent/40 hover:bg-slate-50/90 transition-all h-full"
                          >
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-accent mt-0.5 shrink-0 transition-colors" />
                            <div>
                              <span className="font-bold text-slate-800 group-hover:text-accent block transition-colors leading-snug">
                                <span className="text-slate-400 mr-1">{link.number}.</span> {link.label}
                              </span>
                              <span className="text-xs text-slate-400 block mt-1 font-mono group-hover:text-slate-500 transition-colors break-all">
                                {link.path}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
