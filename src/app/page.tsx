"use client";

import { useSession } from "next-auth/react";
import { TasksTable } from "@/app/components/TasksTable";
import { Header } from "@/app/components/Header";

const Home = () => {
  const { data: session } = useSession({ required: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="p-4 flex-1 flex flex-col gap-10 items-center justify-center bg-gray-50">
        {session ? (
          <>
            <h2 className="text-3xl text-gray-600">
              Welcome, <strong>{session?.user?.name || session?.user?.email}</strong>!
            </h2>

            <TasksTable />
          </>
        ) : (
          <p className="text-lg text-gray-600">Please sign in to continue.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
