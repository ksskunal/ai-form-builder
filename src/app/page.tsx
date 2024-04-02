import { Button } from "@/components/ui/button";
import FormGenerator from "./form-generator";
import Header from "@/components/ui/Header";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <FormGenerator />
      </main>
    </SessionProvider>
  );
}
