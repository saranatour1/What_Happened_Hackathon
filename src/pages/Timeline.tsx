import { useState } from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events, eventTypes, type EventType } from "@/data";

export default function Timeline() {
  const [filter, setFilter] = useState<"All" | EventType>("All");
  const shown = events.filter((e) => filter === "All" || e.type === filter);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your timeline</h1>
          <p className="text-muted-foreground">{events.length} events, newest first.</p>
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            {eventTypes.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </div>

      <ol className="relative grid gap-8 border-l pl-6">
        {shown.map((e) => (
          <li key={e.id} className="relative">
            <span className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
            <a href={`#/event/${e.id}`} className="group grid gap-3">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <time>{new Date(e.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</time>
                <Badge variant="secondary">{e.type}</Badge>
                {e.location && <span className="flex items-center gap-1"><MapPin className="size-3" />{e.location}</span>}
              </div>
              <h2 className="text-xl font-medium group-hover:underline underline-offset-4">{e.title}</h2>
              <div className="flex gap-2 overflow-x-auto">
                {e.moments.map((m) => (
                  <img key={m.id} src={m.photo} alt={m.message} loading="lazy"
                    className="h-32 w-44 shrink-0 rounded-lg object-cover" />
                ))}
              </div>
            </a>
          </li>
        ))}
        {shown.length === 0 && <p className="text-muted-foreground">Nothing here yet.</p>}
      </ol>
    </div>
  );
}
