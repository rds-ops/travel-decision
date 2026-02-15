import { useEffect } from "react";
import { useRouter } from "next/router";

export default function FeedRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
