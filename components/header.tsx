import Link from "next/link";
import { Button } from "@/components/ui/button";
import barkat_main_logo from "../public/barkat_main_logo.png";
import Image from "next/image";

export function Header() {
  return (
    <header className="container flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        {/* <img src="./" alt="Barakat Bayut Logo" /> */}
        <Image
          src={barkat_main_logo}
          alt="Barakat Bayut Logo"
          className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto"
        />
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="#pricing"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Pricing
        </Link>
        <Button className="rounded-full">Sign Up</Button>
      </div>
    </header>
  );
}
