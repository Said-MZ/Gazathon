"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroImage from "./hero-image";

const Hero = () => {
  return (
    <div className="w-full pt-12 lg:pt-0">
      <div className="container mx-auto p-2">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-between flex-col lg:flex-row">
          <div className="flex gap-4 flex-col lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 }}
            ></motion.div>

            <motion.h1
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center lg:text-left font-regular"
            >
              Welcome to Gaza Medical Center
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center lg:text-left"
            >
              We are a team of doctors and nurses who are dedicated to providing
              the best care for our patients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row gap-3"
            >
              <div className="flex flex-wrap gap-4 mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-4 w-48 mx-auto lg:mx-0"
                >
                  <ArrowRight className="w-4 h-4" />
                  About us
                </Button>
                <Button size="lg" className="gap-4 w-48 mx-auto lg:mx-0">
                  <ArrowRight className="w-4 h-4" />
                  Get Started
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 100, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.6 }}
            className="w-full lg:w-1/2 max-w-[50rem] mt-4 lg:mt-0 relative h-[300px] md:h-[400px] overflow-hidden"
          >
            <motion.div
              className="w-full h-full bg-transparent border-transparent"
              animate={{ 
                rotate: [0, 1, 0, -1, 0],
                y: [0, 2, 0, -2, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut",
              }}
            >
              <HeroImage />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
