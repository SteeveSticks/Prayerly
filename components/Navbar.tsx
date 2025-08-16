import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center px-14 py-4 bg-[#0D0D0D]">
      <div className="flex items-center justify-center gap-60">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/images/bible.png"
            alt="Prayerly Logo"
            width={40}
            height={40}
            className="bg-white rounded-full shadow-md"
          />
          <span className="text-xl font-bold text-white ">Prayerly</span>
        </Link>

        <ul className="flex space-x-4">
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

      <div className="ml-auto">
        <Link
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
