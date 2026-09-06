import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Auth({ mode }: { mode: "signIn" | "signUp" }) {
  const signIn = mode === "signIn";
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6">
      <a href="#/" className="flex items-center gap-2 font-semibold">
        <Camera className="size-5" /> What Happened
      </a>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{signIn ? "Welcome back" : "Create an account"}</CardTitle>
          <CardDescription>
            {signIn ? "Sign in to see your timeline." : "Pick a username and a password. That's it."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ponytail: no submit handler; wire to Convex Auth on the backend branch */}
          <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); window.location.hash = "#/timeline"; }}>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" autoComplete="username" placeholder="sara" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={signIn ? "current-password" : "new-password"} required />
            </div>
            <Button type="submit" className="w-full">{signIn ? "Sign in" : "Sign up"}</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {signIn ? "No account?" : "Already have one?"}&nbsp;
          <a href={signIn ? "#/signup" : "#/signin"} className="text-foreground underline underline-offset-4">
            {signIn ? "Sign up" : "Sign in"}
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
