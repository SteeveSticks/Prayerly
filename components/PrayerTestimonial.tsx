import Marquee from "react-fast-marquee";
import femaleAdeventure from "../public/images/svg/femaleAdventure.svg";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

const testimonials = [
  {
    content:
      "Prayerly is a community of believers who come together to share prayers, stories, and inspiration. Our mission is to uplift and support each other through the power of prayer.",
    profile: "/images/svg/femaleAdventure.svg",
    tag: <a href="#" target="_blank" rel="noopener noreferrer"></a>,
  },

  {
    content:
      "Prayerly is a community of believers who come together to share prayers, stories, and inspiration. Our mission is to uplift and support each other through the power of prayer.",
    profile: femaleAdeventure,
    tag: <a href="#" target="_blank" rel="noopener noreferrer"></a>,
  },

  {
    content:
      "Prayerly is a community of believers who come together to share prayers, stories, and inspiration. Our mission is to uplift and support each other through the power of prayer.",
    profile: femaleAdeventure,
    tag: <a href="#" target="_blank" rel="noopener noreferrer"></a>,
  },

  {
    content:
      "Prayerly is a community of believers who come together to share prayers, stories, and inspiration. Our mission is to uplift and support each other through the power of prayer.",
    profile: femaleAdeventure,
    tag: <a href="#" target="_blank" rel="noopener noreferrer"></a>,
  },
];

const PrayerTestimonial = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center text-white pt-20">
        <p className="text-xs mb-2">READ OUR BLOG</p>
        <h2 className="text-2xl font-semibold">SHARE, INSPIRE, INNOVATE</h2>
      </div>

      <Marquee speed={50} delay={5} pauseOnHover={true} className="py-12">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Link href={testimonial.tag.props.href}>
              <div className="flex items-center justify-center text-gray-800 border p-4 rounded-sm bg-white mr-6 z-10 max-w-sm gap-2 text-wrap hover:bg-gray-200 transition-colors">
                <Image
                  src={testimonial.profile}
                  alt="testimonialImage"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="text-black">{testimonial.content}</div>
              </div>
            </Link>
            <Link href={testimonial.tag.props.href} className="">
              <div className="flex items-center justify-center text-gray-800 border p-4 rounded-sm bg-white z-10 max-w-sm gap-2 text-wrap hover:bg-gray-200 transition-colors">
                <Image
                  src={testimonial.profile}
                  alt="testimonialImage"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="text-black">{testimonial.content}</div>
              </div>
            </Link>
          </div>
        ))}
      </Marquee>

      <div className="flex flex-col items-center justify-center mt-10 text-center text-white pt-20 pb-20 space-y-4">
        <h1 className="text-white text-4xl font-semibold">JOIN US TODAY</h1>
        <Link href="sign-up">
          <Button className="bg-[#FFD2A4] text-[#161722] hover:bg-[#FFB07C] cursor-pointer mx-auto flex py-4 px-6">
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PrayerTestimonial;
