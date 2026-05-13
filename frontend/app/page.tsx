import Hero from "@/components/landing-page/Hero";
import About from "@/components/landing-page/About";
import Service from "@/components/landing-page/Service";
import Contact from "@/components/landing-page/Contact";
import Footer from "@/components/landing-page/Footer";
import Nav from "@/components/landing-page/Nav";

export default function Home() {

  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Service />
      <Contact />
      <Footer />
    </main>
  );
}
