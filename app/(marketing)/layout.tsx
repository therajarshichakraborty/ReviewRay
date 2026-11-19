import { Footer } from '@/components/landing/footer';
import { Rails } from '@/components/landing/primitives';
import { PublicHeader } from '@/components/public-header';

/** Shared frame for every public page: header, guide rails and footer. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip">
      <PublicHeader />
      <main>
        <Rails>
          {children}
          <Footer />
        </Rails>
      </main>
    </div>
  );
}
