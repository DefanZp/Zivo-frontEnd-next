import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome to Zivo
          </h1>

          <p className="mt-3 text-muted-foreground">
            Your modern shopping experience.
          </p>

          <Button className="mt-6">
            Belanja Sekarang
          </Button>
        </div>
      </main>
    </div>
  );
}