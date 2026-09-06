import { ArrowLeft, MapPin, Merge, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { events } from "@/data";

export default function EventPage({ id }: { id?: string }) {
  const event = events.find((e) => e.id === id);
  if (!event) return <p className="text-muted-foreground">Event not found. <a href="#/timeline" className="underline">Back</a></p>;

  return (
    <div className="grid gap-6">
      <Button variant="ghost" size="sm" className="w-fit" nativeButton={false} render={<a href="#/timeline" />}>
        <ArrowLeft /> Timeline
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: "long" })}</time>
            <Badge variant="secondary">{event.type}</Badge>
            {event.location && <span className="flex items-center gap-1"><MapPin className="size-3" />{event.location}</span>}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{event.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Plus /> Add moment</Button>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}><Merge /> Merge</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Merge into another event</DialogTitle>
                <DialogDescription>
                  All {event.moments.length} moments move to the event you pick. This one is deleted.
                </DialogDescription>
              </DialogHeader>
              <ul className="grid gap-1">
                {events.filter((e) => e.id !== event.id).map((e) => (
                  <li key={e.id}><Button variant="ghost" className="w-full justify-start">{e.title}</Button></li>
                ))}
              </ul>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        {event.moments.map((m) => (
          <Card key={m.id} className="overflow-hidden pt-0">
            <img src={m.photo} alt={m.message} className="aspect-[4/3] w-full object-cover" />
            <CardContent className="grid gap-1">
              <time className="text-xs text-muted-foreground">{m.takenAt}</time>
              <p>{m.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
