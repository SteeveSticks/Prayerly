import Image from "next/image";
import Link from "next/link";
import React from "react";

const PrayerBenefits = () => {
  return (
    <article className="py-20">
      <div>
        <div className="flex flex-col items-center justify-center text-center text-white pt-20">
          <p className="text-xs mb-2">WATCH AND LISTEN</p>
          <h2 className="text-2xl font-semibold">
            THE BENEFITS OF <br /> JOINING OUR COMMUNITY
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 pt-10">
        <Link href="/sign-in" className="hover:shadow-2xl">
          <div className="relative">
            <Image
              src="/images/prayingNun.png"
              alt="prayerly-benefits"
              width={230}
              height={400}
            />

            <div className="flex flex-col items-start justify-end absolute inset-0 text-white p-3">
              <h3 className="text-base font-semibold mb-2">
                DAILY INSPIRATION
              </h3>

              <p className="text-xs text-wrap text-gray-300 leading-normal">
                Prayerly is a place where you can find uplifting prayers and
                scriptures every day to keep going.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/sign-in">
          <div className="relative">
            <Image
              src="/images/HandBible.png"
              alt="prayerly-benefits"
              width={230}
              height={400}
            />

            <div className="flex flex-col items-start justify-end absolute inset-0 text-white p-3">
              <h3 className="text-base font-semibold mb-2">
                FAITH-FILLED GRWOTH
              </h3>
            </div>
          </div>
        </Link>

        <Link href="/sign-in">
          <div className="relative">
            <Image
              src="/images/ReadingBible.png"
              alt="prayerly-benefits"
              width={230}
              height={400}
            />

            <div className="flex flex-col items-start justify-end absolute inset-0 text-white p-3">
              <h3 className="text-base font-semibold mb-2">
                PERSONALIZED PRAYERS
              </h3>

              <p className="text-xs text-wrap text-gray-300 leading-normal">
                Choose themes like healing, gratitude, protection, or guidance
                that match your journey.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/sign-in">
          <div className="relative">
            <Image
              src="/images/PrayerArts.png"
              alt="prayerly-benefits"
              width={230}
              height={400}
            />

            <div className="flex flex-col items-start justify-end absolute inset-0 text-white p-3">
              <h3 className="text-base font-semibold mb-2">
                PERSONALIZED PRAYERS
              </h3>

              <p className="text-xs text-wrap text-gray-300 leading-normal">
                Choose themes like healing, gratitude, protection, or guidance
                that match your journey.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
};

export default PrayerBenefits;
