'use client';

import { Button } from "@/components/ui/button";

export default function Hello() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Hello Mini App</h1>
      <p className="text-lg text-muted-foreground">
        Welcome to the minimal hello mini app.
      </p>
      <Button variant="outline">Click Me</Button>
    </div>
  );
}
