import Hero from "@/components/Hero";
import InternationalAffiliate from "@/components/InternationalAffiliate";
import Membership from "@/components/Membership";
import StrategicAllies from "@/components/StrategicAllies";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <InternationalAffiliate />
        <Membership />
        <StrategicAllies />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
