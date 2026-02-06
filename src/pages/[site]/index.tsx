import { useRouter } from 'next/router';
// import { useAuth } from "@/utils/AuthContext";
import { BlogListingPanel } from '@/templates/BlogListingPanel';
import { FormSelectionPanel } from '@/templates/FormSelectionPanel';

export default function PortalPage() {
  const router = useRouter();

  const { site } = router.query;

  if (site == 'omlogistics') {
    return <BlogListingPanel website="omlogistics" />;
  }

  if (site == 'sanjvik') {
    return <BlogListingPanel website="sanjvik" />;
  }

  if (site === 'forms') {
    return <FormSelectionPanel />;
  }

  if (!site) {
    return <div className="flex h-screen items-center justify-center">No site specified.</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      Invalid site: {site}
    </div>
  );
}