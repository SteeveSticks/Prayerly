import { Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const PrayerFooter = () => {
  return (
    <div className="flex items-center justify-between bg-[#161722] text-white px-20 py-8">
      <div>
        <div className="mb-5">
          <Link href="/" className="flex items-center justify-start mb-2">
            <Image
              src="/images/bible.png"
              alt="Prayerly Logo"
              width={40}
              height={40}
              className="bg-white rounded-full shadow-md"
            />
            <span className="text-xl font-bold text-white ">Prayerly</span>
          </Link>

          <p className="text-xs">@COPYRIGHT PRAYERLY 2025</p>
        </div>

        <ul className="flex flex-col space-y-3 text-xs">
          <li>+234 (091) 185 93598</li>
          <li>JOY STREET AVENUE</li>
          <li>Prayerly.com</li>
        </ul>
      </div>

      <div>
        <p className="text-white text-lg mb-2">QiuckLinks</p>

        <ul className="text-xs space-y-4">
          <li>
            <Link
              href="/"
              className="text-white hover:text-gray-300 font-light"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-white hover:text-gray-300 font-light"
            >
              ABOUT US
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-white hover:text-gray-300 font-light"
            >
              BLOG
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-white hover:text-gray-300 font-light"
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-23">
        <p className="text-white text-lg mb-2">Connect</p>

        <div className="flex items-center justify-center space-x-4">
          <Facebook className="cursor-pointer" size={20} />
          <Twitter className="cursor-pointer" size={20} />
          <Linkedin className="cursor-pointer" size={20} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-white text-bold text-2xl mb-2">
          SUBSCRIBE TO GET LATEST <br /> UPDATES AND NEWS
        </h2>

        <div className="flex w-full max-w-sm items-center gap-2">
          <Input type="email" placeholder="Yourmail@gmail.com" />
          <Button
            type="submit"
            className="bg-[#FFD2A4] text-[#161722] hover:bg-[#FFB07C] cursor-pointer"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrayerFooter;
