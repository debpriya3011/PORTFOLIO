import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import PostsWidget from '@/components/PostsWidget';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <Footer />
      <PostsWidget />
    </main>
  );
}
