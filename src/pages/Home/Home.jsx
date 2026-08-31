
import Navbar from '../../components/Navbar/Navbar.jsx';
import DotBackground from '../../components/DotBackground/DotBackground.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Features from '../../components/Features/Features.jsx';
// import { Dot } from 'lucide-react';
import HowItWorks from '../../components/HowItWorks/HowItWorks.jsx';
import Faq from '../../components/FAQ/FAQ.jsx';
import Footer from '../../components/Footer/Footer.jsx';



function Home() {
  return (
    <div>
      <Navbar />
      <DotBackground>
        <Hero />
        <Features />  
        <HowItWorks />
        <Faq />
      </DotBackground>
      
    
      
      <Footer /> 
    </div>
  );
}

export default Home;