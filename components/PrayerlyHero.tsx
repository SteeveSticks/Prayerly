import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PrayerlyHero = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <article>
        <Image
          src="/images/Home-Header.jpg"
          alt="Prayerly Hero Image"
          width={1586}
          height={1059}
          className="w-full h-auto object-cover -z-10"
        />
      </article>

      <div className="absolute inset-0 grid items-center justify-start text-left px-14 text-wrap pt-28">
        <div className="max-w-2xl space-y-4">
          <p className="text-white text-sm">WELCOME TO PRAYERLY</p>
          <h1 className="text-4xl font-bold text-white leading-normal">
            YOUR DAILY DOSE OF <br /> PRAYER AND INSPIRATION
          </h1>

          <Link href="/sign-in">
            <Button className="bg-[#FFD2A4] text-[#161722] hover:bg-[#FFB07C] cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
        <div>
          <p className="text-white text-sm bg-black p-3 flex w-1/2 items-center gap-2 rounded-md">
            <ArrowRight />
            Join our community of believers and discover the power of prayer and
            inspiration in your daily life.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrayerlyHero;
