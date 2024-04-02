import React from "react";
import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../button";

type Props = {};

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}

const Header = async (props: Props) => {
  const session = await auth();
  return (
    <header className="border bottom-1">
      <nav className="bg-white border-gray-200 px-4 py-2.5">
        <div className=" flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <h1>AI Form Builder</h1>
          <div>
            {session?.user ? (
              <div className=" flex items-center gap-4">
                {session.user.name && session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={40}
                    height={40}
                    className=" rounded-full"
                  />
                )}
                <SignOut />
              </div>
            ) : (
              <Link href="/api/auth/signin">
                <Button variant="link">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
