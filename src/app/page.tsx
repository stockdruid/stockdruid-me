import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { KonamiEgg } from "@/components/KonamiEgg";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Stack } from "@/components/Stack";
import { projects } from "@/content/projects";
import { site, stack } from "@/content/site";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.displayName,
  url: site.url,
  email: site.email,
  jobTitle: site.role,
  description: site.summary,
  sameAs: [site.links.github, site.links.linkedin].filter(Boolean),
  knowsAbout: [
    ...new Set([
      ...stack.flatMap((g) => g.items.map((i) => i.name)),
      ...projects.flatMap((p) => p.stack),
    ]),
  ],
};

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <KonamiEgg />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
