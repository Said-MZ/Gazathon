import Navbar from "@/components/global/navbar";
import CardsWrapper from "@/components/home/cards-container";
import Hero from "@/components/home/hero";

const HomePage = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <CardsWrapper />
    </main>
  );
};

export default HomePage;
