import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow pt-16 px-4 max-w-7xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
