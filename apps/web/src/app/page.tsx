"use client";

import { useQuery } from "@/hooks/use-query";
import { api } from "@sbkl-turborepo/api";

export default function Home() {
  const { data: user } = useQuery(api.users.query.me, {});
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {JSON.stringify(user, null, 2)}
    </div>
  );
}
