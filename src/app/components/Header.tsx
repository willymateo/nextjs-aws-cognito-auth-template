"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession({ required: false });

  const handleSignIn = () => signIn("cognito");
  const handleSignOut = () => signOut();

  return (
    <header className="bg-fuchsia-50 p-4 flex items-center justify-between">
      <strong className="text-lg text-gray-700">AWS Community Day Ecuador 2025</strong>

      <div className="flex items-center justify-center gap-4">
        {status === "loading" && (
          <>
            <div className="w-46 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse" />
          </>
        )}

        {status !== "loading" && !!session && (
          <>
            <span className="text-gray-600">{session.user?.email}</span>

            <button
              className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full transition-colors"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </>
        )}

        {status !== "loading" && !session && (
          <button
            className="cursor-pointer bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-full transition-colors"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export { Header };
