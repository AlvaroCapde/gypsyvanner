import Hero from "@/components/Hero";
import InternationalAffiliate from "@/components/InternationalAffiliate";
import RegistrationProcessFlow from "@/components/RegistrationProcessFlow";
import Membership from "@/components/Membership";
import StrategicAllies from "@/components/StrategicAllies";
import FAQ from "@/components/FAQ";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <InternationalAffiliate />
        <RegistrationProcessFlow />
        <Membership />
        <StrategicAllies />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
