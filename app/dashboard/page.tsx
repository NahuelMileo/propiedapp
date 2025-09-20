"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single();
      if (!error) setProfile(data);
    };

    fetchProfile();
  }, []);

  return <h1 className="text-7xl">{profile?.full_name}</h1>;
}
