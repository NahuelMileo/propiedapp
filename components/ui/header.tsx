"use client";
import { Separator } from "./separator";
import { SidebarTrigger } from "./sidebar";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathSegment = usePathname().split("/")[1] || "";
  const path = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="font-semibold">{path}</h1>
      </div>
    </header>
  );
}
