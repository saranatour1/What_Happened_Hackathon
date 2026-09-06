import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventTypes, user } from "@/data";

export default function Settings() {
  const [custom, setCustom] = useState(user.customTypes);
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim();
    if (t && ![...eventTypes, ...custom].some((x) => x.toLowerCase() === t.toLowerCase())) setCustom([...custom, t]);
    setDraft("");
  };

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Member since {new Date(user.joined).toLocaleDateString(undefined, { dateStyle: "medium" })}.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue={user.username} />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button>Save</Button>
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
                <button type="button" aria-label={`Remove ${t}`} onClick={() => setCustom(custom.filter((x) => x !== t))}
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
