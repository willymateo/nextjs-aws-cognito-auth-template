"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  const handleSignIn = () => signIn("cognito");
  const handleSignOut = () => signOut();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-fuchsia-50">
        <div className="p-4 flex items-center justify-between">
          <strong className="text-lg text-gray-700">Next.js AWS Cognito Auth Template</strong>

          <div className="flex items-center justify-center gap-4">
            {session ? (
              <>
                <span className="text-gray-600">{session.user?.email}</span>

                <button
                  className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md transition-colors"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                className="cursor-pointer bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 items-center justify-center">
        {session ? (
          <div className="text-center">
            <h2 className="text-2xl text-gray-600">
              Welcome, <strong>{session?.user?.name || session?.user?.email}</strong>!
            </h2>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Please sign in to continue.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
