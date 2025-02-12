import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import SparklesText from "@/components/sparkles-text";
import { BorderBeam } from "@/components/border-beam";

import landingImg from "./landing-img.png";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("mb-4 flex flex-col items-center justify-center")}>
        <SparklesText text={"Flowline"} />
        <h1 className="mb-6 text-center text-3xl md:text-6xl">
          Supercharge Team Productivity
        </h1>
      </div>

      <div className="relative h-[512px] rounded-xl">
        <BorderBeam />
        <Image src={landingImg} alt="Tasky Board" priority />
      </div>

      <div
        className={cn(
          "mx-auto mt-4 max-w-xs text-center text-sm font-light text-muted-foreground md:max-w-2xl md:text-xl",
        )}
      >
        直感的なタスク管理プラットフォームで、チームの働き方を革新します。
        進捗の可視化、シームレスな協働を実現し、より大きな成果を共に達成しましょう。
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href="/signup">Get Flowline</Link>
      </Button>
    </div>
  );
}
