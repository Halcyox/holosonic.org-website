import React from 'react';
import { Link } from 'react-router-dom';
import Citation from '../components/Citation/Citation';
import Footer from '../components/Footer/Footer';
import { researchCitations, technicalSpecs } from '../data/research';
import './TechnologyPage.css';

function SyntheticBiology() {
  return (
    <>
      <header className="technology-hero">
        <div className="container">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Synthetic Biology Applications</h1>
          <p className="technology-subtitle">
            Developing acoustic hologram-based cell patterning and tissue engineering systems
          </p>
        </div>
      </header>

      <main className="technology-content">
        <div className="container">
          <section className="technology-section">
            <h2>Our Vision</h2>
            <p>
              We're developing acoustic hologram-based systems for precise manipulation of living cells 
              and cell aggregates using gentle, non-contact acoustic fields. Our goal is to create 
              technologies that maintain sterility and cell viability while enabling precise spatial 
              organization for organoid formation and regenerative medicine applications.
            </p>
            <p>
              Unlike traditional cell manipulation methods that may damage cells or compromise sterility, 
              acoustic manipulation offers a fundamentally different approach—one that is gentle, 
              contactless, and uniquely suited for biological applications where cell health is paramount.
            </p>
          </section>

          <section className="technology-section">
            <h2>The Biological Advantage</h2>
            <p>
              Research demonstrates that acoustic fields can manipulate living cells while maintaining 
              their viability—a critical requirement for any biological application. Research by <Citation id={2} /> 
              shows that acoustic holograms can manipulate living cells and cell aggregates in a 
              non-contact, gentle, and non-toxic manner.
            </p>
            <p>
              The contactless nature of acoustic manipulation ensures complete sterility, eliminating 
              the risk of contamination that can occur with traditional cell handling methods like 
              pipetting or mechanical manipulation. This is particularly important for applications 
              requiring long-term cell culture or clinical translation.
            </p>
            <p>
              The gentle nature of acoustic fields means that cell viability is maintained throughout 
              the manipulation process—a finding that opens possibilities for extended manipulation 
              and culture periods that would be impossible with more invasive methods.
            </p>
          </section>

          <section className="technology-section">
            <h2>Deep Penetration: A Unique Capability</h2>
            <p>
              One of the most promising aspects of acoustic-based manipulation is its ability to work 
              through optically opaque materials. Research on deep-penetration acoustic volumetric printing 
              by <Citation id={3} /> demonstrates the ability to print {technicalSpecs.penetrationDepth.toLowerCase()}, 
              opening possibilities for in vivo applications that are impossible with light-based methods.
            </p>
            <p>
              This deep penetration capability is unique to acoustic-based methods. While light scatters 
              or is absorbed by biological tissue, sound waves can penetrate deeply, enabling manipulation 
              and fabrication within living systems. This could enable entirely new approaches to tissue 
              engineering, drug delivery, and regenerative medicine.
            </p>
            <p>
              The research suggests that sound-active material design for ultrasound 3D printing could 
              enable printing inside materials that scatter light, potentially allowing for in vivo 
              fabrication and manipulation that current methods cannot achieve.
            </p>
          </section>

          <section className="technology-section">
            <h2>Target Applications</h2>
            <p>
              We're exploring applications where the unique advantages of acoustic manipulation—gentleness, 
              sterility, and deep penetration—offer transformative possibilities:
            </p>
            <ul className="capabilities-list">
              <li><strong>Organoid formation:</strong> Precise spatial organization of cells for organoid development, enabling more physiologically relevant tissue models</li>
              <li><strong>Cell patterning:</strong> Arranging cells in specific 3D configurations to create complex tissue architectures</li>
              <li><strong>Regenerative medicine:</strong> Creating tissue structures for medical applications with maintained cell viability</li>
              <li><strong>3D cell culture:</strong> Building complex 3D cell culture structures that better mimic in vivo environments</li>
              <li><strong>In vivo applications:</strong> Potential for manipulation and fabrication within living systems, enabled by deep penetration</li>
            </ul>
          </section>

          <section className="technology-section">
            <h2>Research Foundation</h2>
            <p>
              Our development is grounded in research that demonstrates the feasibility of acoustic 
              manipulation for biological applications. The work by Melde et al. <Citation id={2} /> 
              at the Max Planck Institute for Medical Research and Heidelberg University demonstrates 
              that acoustic holograms can manipulate living cells and cell aggregates while maintaining 
              cell viability.
            </p>
            <p>
              Key findings that inform our development:
            </p>
            <ul className="capabilities-list">
              <li>Acoustic manipulation is non-contact, gentle, and non-toxic to cells</li>
              <li>Cell viability is maintained throughout the manipulation process</li>
              <li>Sterility is preserved, critical for biological applications</li>
              <li>Multiple objects can be manipulated simultaneously with independent control</li>
            </ul>
            <p>
              Additionally, research on deep-penetration acoustic printing by <Citation id={3} /> 
              demonstrates capabilities that could enable entirely new classes of biological applications, 
              particularly those requiring in vivo manipulation or fabrication.
            </p>
          </section>

          <section className="technology-section">
            <h2>Potential Impact Areas</h2>
            <p>
              The applications we're exploring span synthetic biology and regenerative medicine, 
              where gentle, contactless manipulation could enable new capabilities:
            </p>
            <ul className="applications-list">
              <li><strong>Organoid and tissue engineering:</strong> Creating more physiologically accurate tissue models for research and potential therapeutic applications</li>
              <li><strong>Regenerative medicine:</strong> Developing approaches to tissue repair and replacement with maintained cell viability</li>
              <li><strong>3D cell culture systems:</strong> Building complex culture environments that better mimic in vivo conditions</li>
              <li><strong>Drug screening platforms:</strong> Creating more accurate tissue models for pharmaceutical testing</li>
              <li><strong>In vivo printing applications:</strong> Potential for manipulation and fabrication within living systems</li>
              <li><strong>Biomedical research:</strong> Enabling new experimental approaches that require gentle, sterile manipulation</li>
            </ul>
          </section>

          <section className="technology-section">
            <h2>Development Roadmap</h2>
            <p>
              As a startup in active R&D, we're working to translate promising research in acoustic 
              cell manipulation into practical systems for synthetic biology applications. Our 
              development focuses on:
            </p>
            <ul className="capabilities-list">
              <li>Optimizing acoustic field parameters for different cell types and applications</li>
              <li>Developing systems that maintain cell viability over extended manipulation periods</li>
              <li>Exploring deep-penetration capabilities for in vivo applications</li>
              <li>Validating applications in organoid formation and tissue engineering</li>
              <li>Scaling from laboratory demonstrations to systems suitable for research and clinical use</li>
            </ul>
            <p>
              We're actively seeking collaborations with research institutions and biotechnology 
              companies to accelerate development and validate applications in real-world biological 
              systems.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default SyntheticBiology;

