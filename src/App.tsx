import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Timeline from "@/pages/Timeline";
import EventPage from "@/pages/Event";
import NewEvent from "@/pages/NewEvent";
import Settings from "@/pages/Settings";

// ponytail: hash router in 10 lines; swap for react-router when nested routes appear
function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash.replace(/^#\/?/, "");
}

export default function App() {
  const route = useHash();
  const [path, param] = route.split("/");

  if (path === "") return <Landing />;
  if (path === "signin") return <Auth mode="signIn" />;
  if (path === "signup") return <Auth mode="signUp" />;

  return (
    <Shell>
      {path === "timeline" && <Timeline />}
      {path === "event" && <EventPage id={param} />}
      {path === "new" && <NewEvent />}
      {path === "settings" && <Settings />}
      {path !== "timeline" && path !== "event" && path !== "new" && path !== "settings" && <Timeline />}
    </Shell>
  );
}
