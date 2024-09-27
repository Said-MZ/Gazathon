import Navbar from "@/components/global/navbar";
import CardsWrapper from "@/components/home/cards-container";
import GeneralData from "@/components/home/general-statics";

const HomePage = () => {
  return (
    <main>
      <Navbar />
      <GeneralData />
      <CardsWrapper />
    </main>
  );
};

export default HomePage;
