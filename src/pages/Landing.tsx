import { Camera, Clock, Layers, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { icon: Clock, title: "A timeline, not a grid", body: "Every photo lands where it happened in your life, in order." },
  { icon: Tag, title: "Your own event types", body: "Trips, milestones, everyday moments, or whatever you invent." },
  { icon: Layers, title: "Group and merge", body: "Nest Paris and Rome under Europe. Merge duplicates in one click." },
];

export default function Landing() {
  return (
    <div className="min-h-svh bg-background">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="flex items-center gap-2 font-semibold">
          <Camera className="size-5" /> What Happened
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" nativeButton={false} render={<a href="#/signin" />}>Sign in</Button>
          <Button nativeButton={false} render={<a href="#/signup" />}>Get started</Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
          Remember what actually happened.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground text-balance">
          A personal photo timeline. Upload a photo, say when and what it was, and watch your year fall into place.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<a href="#/signup" />}>Start your timeline</Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<a href="#/timeline" />}>See a demo</Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-24 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <f.icon className="size-5 text-muted-foreground" />
              <CardTitle className="mt-2">{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
