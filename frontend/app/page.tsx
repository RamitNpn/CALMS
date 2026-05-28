import Hero from "@/components/landing-page/Hero";
import About from "@/components/landing-page/About";
import Contact from "@/components/landing-page/Contact";
import Footer from "@/components/landing-page/Footer";
import Nav from "@/components/landing-page/Nav";
import Stats from "@/components/landing-page/Stats";
import Features from "@/components/landing-page/Features";

export default function Home() {

  return (
    <main>
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Features />
      <Contact />
      <Footer />
    </main>
  );
}
