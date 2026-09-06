import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventTypes, user } from "@/data";

function formatJoined(dateOnly: string) {
  const [y, m, d] = dateOnly.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { dateStyle: "medium" });
}

export default function Settings() {
  const [custom, setCustom] = useState(user.customTypes);
  const [draft, setDraft] = useState("");
  const [username, setUsername] = useState(user.username);
  const [saved, setSaved] = useState(false);

  // ponytail: mutate the shared mock `user` object so NewEvent (which reads it fresh on mount) sees the change; upgrade to Convex storage when the backend lands
  const add = () => {
    const t = draft.trim();
    if (t && ![...eventTypes, ...custom].some((x) => x.toLowerCase() === t.toLowerCase())) {
      const next = [...custom, t];
      user.customTypes = next;
      setCustom(next);
    }
    setDraft("");
  };

  const save = () => {
    user.username = username;
    setSaved(true);
  };

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Member since {formatJoined(user.joined)}.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => { setUsername(e.target.value); setSaved(false); }} />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          {saved && <span className="text-sm text-muted-foreground">Saved</span>}
          <Button onClick={save}>Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event types</CardTitle>
          <CardDescription>Built-in types stay. Add your own.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
            {custom.map((t) => (
              <Badge key={t} variant="outline" className="gap-1 pr-1">
                {t}
                <button type="button" aria-label={`Remove ${t}`} onClick={() => {
                  const next = custom.filter((x) => x !== t);
                  user.customTypes = next;
                  setCustom(next);
                }}
                  className="rounded-full p-0.5 hover:bg-muted"><X className="size-3" /></button>
              </Badge>
            ))}
          </div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); add(); }}>
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Recipes, Concerts, …" />
            <Button type="submit" variant="outline">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Deletes every event and photo. No undo.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="destructive">Delete account</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
