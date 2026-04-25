"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label = "تصدير PDF" }: { label?: string }) {
  return (
    <Button type="button" onClick={() => window.print()} className="rounded-2xl">
      <FileDown className="ml-2 h-4 w-4" />
      {label}
    </Button>
  );
}
