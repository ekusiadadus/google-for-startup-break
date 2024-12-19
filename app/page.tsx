import { title, subtitle } from "@/components/primitives";
import SeatingMap from "@/components/seating-map";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Goole&nbsp;</span>
        <span className={title({ color: "violet" })}>for Startups&nbsp;</span>
        <br />
        <span className={title()}>キャンパスで話そう！</span>
      </div>

      <SeatingMap />
    </section>
  );
}
