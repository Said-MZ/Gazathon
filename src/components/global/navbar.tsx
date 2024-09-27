"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ArrowRight, Heart, MoveRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SubItem = {
  title: string;
  href: string;
};

type NavigationItem = {
  title: string;
  href?: string;
  description: string;
  items?: SubItem[];
};

const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
    description: "",
  },
  {
    title: "About",
    href: "/about",
    description: "",
  },
  {
    title: "Contact",
    description: "We are open to any questions you may have.",
    items: [
      { title: "Phone", href: "/contact/phone" },
      { title: "Email", href: "/contact/email" },
      { title: "Support", href: "/support" },
    ],
  },
];

type PathProps = {
  variants?: {
    closed: { d: string; opacity: number };
    open: { d: string; opacity: number };
  };
  d?: string;
  transition?: { duration: number };
};

const Path: React.FC<PathProps> = ({ variants, d, transition, ...rest }) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    variants={variants}
    d={d}
    transition={transition}
    {...rest}
  />
);

type MenuToggleProps = {
  toggle: () => void;
  isOpen: boolean;
};

const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => {
  const buttonVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={buttonVariants}
      transition={{ duration: 0.4, ease: "anticipate" }}
    >
      <Button
        variant="ghost"
        onClick={toggle}
        className="p-0 h-12 w-12 !bg-transparent"
      >
        <svg width="23" height="23" viewBox="0 0 23 23">
          <Path
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5", opacity: 1 },
              open: { d: "M 3 16.5 L 17 2.5", opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 9.423 L 20 9.423", opacity: 1 },
              open: { d: "M 2 9.423 L 20 9.423", opacity: 0 },
            }}
            transition={{ duration: 0.4 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346", opacity: 1 },
              open: { d: "M 3 2.5 L 17 16.346", opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
          />
        </svg>
      </Button>
    </motion.div>
  );
};

const Navbar: React.FC = () => {
  const [atTop, setAtTop] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState("100vh");

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY < 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateMenuHeight = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 80; // Adjust based on actual header height
      setMenuHeight(`${viewportHeight - headerHeight}px`);
    };

    updateMenuHeight();
    window.addEventListener("resize", updateMenuHeight);

    return () => window.removeEventListener("resize", updateMenuHeight);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "w-full z-[101] fixed top-0 left-0 backdrop-blur-md transition-all duration-300",
        !atTop && "bg-background/25",
        isOpen && "bg-background/90"
      )}
    >
      <div className="container relative mx-auto min-h-20 flex items-center justify-between p-2">
        {/* Logo */}
        <div className="flex items-center w-[262.75px]">
          <Link href="/">
            {/* <Image
              src="/logo-horizontal.png"
              alt="logo"
              width={180}
              height={50}
              className="py-2"
            /> */}
            <h2 className="text-2xl font-bold">
              Gaza<span className="text-primary">Find</span>
            </h2>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <NavigationMenuLink href={item.href}>
                      <Button variant="ghost">{item.title}</Button>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm bg-transparent">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-auto min-w-max max-w-full p-4 bg-background/90 backdrop-blur-md">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-10">
                              Book a call today
                            </Button>
                          </div>
                          <div className="flex flex-col text-sm h-full justify-end">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                href={subItem.href}
                                key={subItem.title}
                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="outline" className="gap-4" asChild>
            <Link href="/dashboard">
              <Heart className="w-4 h-4 fill-red-500 text-black/20" />
              Donate
            </Link>
          </Button>
          <Button variant="default" className="gap-4" asChild>
            <Link href="/dashboard">
              <ArrowRight className="w-4 h-4" />
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <MenuToggle toggle={() => setOpen(!isOpen)} isOpen={isOpen} />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-20 border-t flex flex-col w-full right-0 bg-background/90 shadow-lg py-4 container gap-8 p-4 overflow-y-auto"
              style={{ height: menuHeight, maxHeight: menuHeight }}
            >
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex justify-between items-center"
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-lg">{item.title}</p>
                    )}
                    {item.items &&
                      item.items.map((subItem) => (
                        <Link
                          href={subItem.href}
                          key={subItem.title}
                          className="text-muted-foreground text-sm ml-4"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
