import React from 'react';
import Hero from '../components/Hero/Hero';
import ResearchCard from '../components/ResearchCard/ResearchCard';
import About from '../components/About/About';
import ResearchSection from '../components/ResearchSection/ResearchSection';
import TechnicalSpecs from '../components/TechnicalSpecs/TechnicalSpecs';
import Footer from '../components/Footer/Footer';
import { researchCitations, technicalSpecs } from '../data/research';

function Home() {
  // Research-integrated copy with citations
  const heroData = {
    title: "Holosonic",
    subtitle: "The Programmable Matter Company.",
    subsubtitle: "Shaping Matter with Sound",
    description: "Hey! We're building high-resolution programmable matter systems using acoustic hologram-based volumetric 3D printing for contactless material manipulation. Our technology generates precise 3D pressure fields to control particles, cells, and materials from nanometers to millimeters with sub-micron precision—enabling layerless fabrication through optically opaque media.",
    citations: [1, 2, 3]
  };

  const features = [
    {
      title: "3D Acoustic Levitation",
      description: "Acoustic hologram-based 3D particle control. Generate multiple interacting pressure fields using phased array transducers, enabling simultaneous manipulation of particles, gel beads, and living cells in arbitrary 3D configurations with independent positioning.",
      citations: [2],
      learnMoreUrl: "/technology/acoustic-levitation",
      learnMoreTooltip: "Learn about our acoustic hologram technology and 3D particle control systems"
    },
    {
      title: "Precision Manufacturing",
      description: "Contactless volumetric 3D printing for precision manufacturing. Fabricate complex structures inside material volumes using acoustic field manipulation, overcoming surface quality limitations of layer-by-layer methods while enabling sub-10 μm  positioning accuracy. Applications include high-precision touchless assembly for semiconductor manufacturing, where contamination-free manipulation is critical.",
      citations: [1],
      learnMoreUrl: "/technology/precision-manufacturing",
      learnMoreTooltip: "Explore our precision manufacturing solutions for semiconductor assembly and more"
    },
    {
      title: "Synthetic Biology Applications",
      description: "Acoustic hologram-based cell patterning and tissue engineering. Manipulate living cells and cell aggregates using gentle, non-contact acoustic fields that maintain sterility and cell viability—enabling precise spatial organization for organoid formation and regenerative medicine.",
      citations: [2, 3],
      learnMoreUrl: "/technology/synthetic-biology",
      learnMoreTooltip: "Discover our applications in tissue engineering and synthetic biology"
    }
  ];

  // Prepare publications for ResearchSection
  const publications = [
    researchCitations.volumetricPrinting,
    researchCitations.acousticHolograms,
    researchCitations.deepAcousticPrinting
  ];

  return (
    <>
      <Hero 
        title={heroData.title}
        subtitle={heroData.subtitle}
        subsubtitle={heroData.subsubtitle}
        description={heroData.description}
        citations={heroData.citations}
      />

      {/* Feature Highlights */}
      <section className="features">
        <div className="container">
          {features.map((feature, index) => (
            <ResearchCard
              key={index}
              title={feature.title}
              description={feature.description}
              citations={feature.citations}
              learnMoreUrl={feature.learnMoreUrl}
              learnMoreTooltip={feature.learnMoreTooltip}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Technical Specifications */}
      <TechnicalSpecs specs={technicalSpecs} />

      {/* Our Research */}
      <section className="our-research">
        <div className="container">
          <h2>Our Research</h2>
          <p className="coming-soon">Coming soon...</p>
        </div>
      </section>

      {/* Related Research */}
      <ResearchSection publications={publications} />

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Explore the Possibilities?</h2>
          {/* <a href="#contact" className="cta-button">
            Get in Touch
          </a> */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;

