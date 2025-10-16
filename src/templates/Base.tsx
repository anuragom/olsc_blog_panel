import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import Navbar from './Navbar';
import Footer from './Footer';
import BlogEditor from '@/templates/BlogEditor';

const Base = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Navbar />
    <main className="flex-1 w-full p-6 mt-24">
      <BlogEditor />
    </main>
    <Footer />
  </div>
);

export { Base };
