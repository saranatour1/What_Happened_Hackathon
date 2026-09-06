import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eventTypes, user } from "@/data";

export default function NewEvent() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>New event</CardTitle>
        <CardDescription>Give it a name, a date, and the first photo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); window.location.hash = "#/timeline"; }}>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Paris in the rain" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-type">Type</Label>
              <Select defaultValue="Everyday">
                <SelectTrigger id="event-type" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[...eventTypes, ...user.customTypes].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="location" placeholder="Paris, France" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">What happened?</Label>
            <Textarea id="message" placeholder="Croissants before the crowds." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photo">Photo</Label>
            <label htmlFor="photo" className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-sm text-muted-foreground hover:bg-muted/50">
              <ImagePlus className="size-6" />
              Drop a photo or click to choose
              <input id="photo" type="file" accept="image/*" className="sr-only" />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" nativeButton={false} render={<a href="#/timeline" />}>Cancel</Button>
            <Button type="submit">Create event</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
