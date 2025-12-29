import React from 'react';
import { Link } from 'react-router-dom';
import Citation from '../components/Citation/Citation';
import Footer from '../components/Footer/Footer';
import { researchCitations, technicalSpecs } from '../data/research';
import './TechnologyPage.css';

function PrecisionManufacturing() {
  return (
    <>
      <header className="technology-hero">
        <div className="container">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Precision Manufacturing</h1>
          <p className="technology-subtitle">
            Developing contactless volumetric 3D printing for high-precision manufacturing
          </p>
        </div>
      </header>

      <main className="technology-content">
        <div className="container">
          <section className="technology-section">
            <h2>Our Vision</h2>
            <p>
              We're developing contactless volumetric 3D printing systems that fabricate complex 
              structures inside material volumes using acoustic field manipulation. This approach 
              represents a fundamental departure from traditional layer-by-layer methods, offering 
              the potential to overcome surface quality limitations while achieving {technicalSpecs.positioningPrecision} 
              positioning accuracy.
            </p>
            <p>
              The technology we're building could be particularly transformative for high-precision 
              touchless assembly in semiconductor manufacturing, where contamination-free manipulation 
              is critical. By eliminating physical contact, we aim to enable new manufacturing 
              capabilities that are impossible with current methods.
            </p>
          </section>

          <section className="technology-section">
            <h2>The Promise of Volumetric Printing</h2>
            <p>
              Traditional 3D printing builds objects layer by layer, which creates inherent limitations: 
              layer lines, surface defects, and the need for support structures. Volumetric printing, 
              as reviewed in <Citation id={1} />, forms structures throughout the entire volume 
              simultaneously—a fundamentally different approach that offers significant advantages.
            </p>
            <p>
              Research indicates that volumetric 3D printing can be faster than conventional 
              layer-by-layer methods, as structures form throughout the volume in parallel rather 
              than sequentially. This layerless fabrication approach also overcomes surface quality 
              issues inherent in additive manufacturing, potentially eliminating the need for extensive 
              post-processing.
            </p>
            <p>
              The contactless nature of acoustic-based volumetric printing is particularly critical 
              for applications involving living cells or sensitive materials, where physical contact 
              could cause damage or contamination. This makes the technology uniquely suited for 
              applications that traditional manufacturing methods cannot address.
            </p>
          </section>

          <section className="technology-section">
            <h2>Target Advantages</h2>
            <p>
              Based on research and our development goals, we're working toward systems that offer:
            </p>
            <ul className="capabilities-list">
              <li><strong>Layerless fabrication:</strong> Structures formed throughout the volume simultaneously, eliminating layer-by-layer limitations</li>
              <li><strong>Faster production:</strong> {technicalSpecs.printingSpeed}, as formation occurs in parallel rather than sequentially</li>
              <li><strong>Superior surface quality:</strong> No layer lines, reduced surface defects, and smoother finishes</li>
              <li><strong>High precision:</strong> {technicalSpecs.positioningPrecision} positioning accuracy for precise material placement</li>
              <li><strong>Contactless process:</strong> No physical contact eliminates contamination risk and surface damage</li>
              <li><strong>Material versatility:</strong> Works with particles ranging from {technicalSpecs.particleSizeRange}</li>
            </ul>
          </section>

          <section className="technology-section">
            <h2>Semiconductor Manufacturing Applications</h2>
            <p>
              Semiconductor manufacturing requires extreme precision and absolute cleanliness. Current 
              handling methods risk contamination, surface damage, or misalignment—any of which can 
              compromise device performance. The contactless nature of acoustic manipulation offers a 
              potential solution to these fundamental challenges.
            </p>
            <p>
              We're exploring how acoustic hologram-based systems could enable precise, contamination-free 
              manipulation and assembly of semiconductor components. By eliminating physical contact, 
              we aim to reduce the risk of surface damage or particle contamination that can occur with 
              traditional handling methods.
            </p>
            <p>
              This could be transformative for maintaining the integrity of sensitive semiconductor 
              components throughout the manufacturing process, potentially enabling new device architectures 
              and higher yields.
            </p>
          </section>

          <section className="technology-section">
            <h2>Research Foundation</h2>
            <p>
              The comprehensive review by Kuang et al. <Citation id={1} /> in Nature Reviews Materials 
              (2025) examines "The road ahead in materials and technologies for volumetric 3D printing." 
              This research highlights the potential advantages of volumetric printing, including faster 
              production times and improved surface quality compared to layer-by-layer methods.
            </p>
            <p>
              Key insights from this research that inform our development:
            </p>
            <ul className="capabilities-list">
              <li>Volumetric 3D printing enables true layerless fabrication, forming structures throughout the volume</li>
              <li>The approach can be significantly faster than conventional methods</li>
              <li>Surface quality issues inherent in layer-by-layer methods can be overcome</li>
              <li>The contactless process is critical for applications involving living cells or sensitive materials</li>
            </ul>
            <p>
              We're building on this research foundation to develop practical systems that realize 
              these potential advantages in commercial manufacturing applications.
            </p>
          </section>

          <section className="technology-section">
            <h2>Potential Use Cases</h2>
            <p>
              The applications we're exploring span precision manufacturing domains where contactless, 
              high-precision fabrication offers significant advantages:
            </p>
            <ul className="applications-list">
              <li><strong>High-precision semiconductor assembly:</strong> Contamination-free manipulation and assembly of microelectronic components</li>
              <li><strong>Optical and photonic components:</strong> Fabrication of complex optical structures with superior surface quality</li>
              <li><strong>Rapid prototyping:</strong> Faster iteration cycles for complex structure development</li>
              <li><strong>Soft robotics:</strong> Manufacturing of compliant structures with integrated functionality</li>
              <li><strong>Micro-electromechanical systems (MEMS):</strong> Precise fabrication of micro-scale mechanical devices</li>
            </ul>
          </section>

          <section className="technology-section">
            <h2>Development Roadmap</h2>
            <p>
              As a startup in active R&D, we're working to translate the promising research in 
              volumetric printing into practical manufacturing systems. Our development focuses on:
            </p>
            <ul className="capabilities-list">
              <li>Advancing acoustic field generation for precise material manipulation throughout volumes</li>
              <li>Developing sound-active materials optimized for acoustic volumetric printing</li>
              <li>Scaling systems from laboratory demonstrations to production-capable platforms</li>
              <li>Optimizing for specific manufacturing applications, particularly in semiconductor assembly</li>
            </ul>
            <p>
              We're actively seeking partnerships with manufacturers and research institutions to 
              accelerate development and validate applications in real-world manufacturing environments.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PrecisionManufacturing;

