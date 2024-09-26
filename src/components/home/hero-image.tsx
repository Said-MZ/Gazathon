import Image from "next/image";
import { motion } from "framer-motion";

const HeroImage = () => {
  const images = [
    {
      id: 1,
      src: "/hero-1.svg",
      alt: "Hero Image 1",
    },
    {
      id: 2,
      src: "/hero-2.svg",
      alt: "Hero Image 2",
    },
    {
      id: 3,
      src: "/hero-3.svg",
      alt: "Hero Image 3",
    },
    {
      id: 4,
      src: "/hero-4.svg",
      alt: "Hero Image 4",
    },
    {
      id: 5,
      src: "/hero-5.svg",
      alt: "Hero Image 5",
    },
    {
      id: 6,
      src: "/hero-6.svg",
      alt: "Hero Image 6",
    },
    {
      id: 7,
      src: "/hero-7.svg",
      alt: "Hero Image 7",
    },
    {
      id: 8,
      src: "/hero-8.svg",
      alt: "Hero Image 8",
    },
    {
      id: 9,
      src: "/hero-9.svg",
      alt: "Hero Image 9",
    },
    {
      id: 10,
      src: "/hero-10.svg",
      alt: "Hero Image 10",
    },
  ];

  return (
    <div className="relative w-full h-full">
      {images.map((image) => {
        const Component = image.id === 2 || image.id === 4 ? 'div' : motion.div;
        
        // Generate random values for each image
        const randomY = Math.random() * 15 + 10; // Random value between 10 and 25
        const randomX = Math.random() * 6 + 2;   // Random value between 2 and 8
        const randomRotate = Math.random() * 3 + 1; // Random value between 1 and 4
        const randomDuration = Math.random() * 3 + 3; // Random duration between 3 and 6 seconds
        
        return (
          <Component
            key={image.id}
            className="absolute w-full h-full"
            {...(image.id !== 2 && image.id !== 4 && {
              initial: { y: 0, x: 0, rotate: 0 },
              animate: { 
                y: [0, -randomY, 0],
                x: [-randomX, randomX, -randomX],
                rotate: [-randomRotate, randomRotate, -randomRotate],
              },
              transition: {
                duration: randomDuration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 2,
              }
            })}
          >
            <Image src={image.src} alt={image.alt} fill />
          </Component>
        );
      })}
    </div>
  );
};

export default HeroImage;
