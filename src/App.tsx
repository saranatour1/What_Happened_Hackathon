"use client";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useSignInWithPassword } from "@convex-dev/auth/providers/password/react";
import { useSignUpWithPassword } from "@convex-dev/auth/providers/password/react";
import { useState } from "react";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        Convex + React + Convex Auth
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">
          Convex + React + Convex Auth
        </h1>
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      )}
    </>
  );
}

function SignInForm() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to see the numbers</p>
      {flow === "signIn" ? <LogInForm /> : <SignUpForm />}
      <div className="flex flex-row gap-2 justify-center">
        <span>
          {flow === "signIn"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <span
          className="text-dark dark:text-light underline hover:no-underline cursor-pointer"
          onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
        >
          {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
        </span>
      </div>
    </div>
  );
}

function passwordErrorMessage(userError: {
  error: string;
  minimumLength?: number;
  maximumLength?: number;
  retryAfterMs?: number;
  cause?: unknown;
}): string {
  switch (userError.error) {
    case "USERNAME_TAKEN":
      return "That username is already taken.";
    case "USERNAME_TOO_SHORT":
      return `Username must be at least ${userError.minimumLength} characters.`;
    case "USERNAME_HAS_SURROUNDING_WHITESPACE":
      return "Username can't start or end with whitespace.";
    case "USERNAME_HAS_INVALID_CHARACTERS":
      return "Username contains characters that aren't allowed.";
    case "PASSWORD_TOO_SHORT":
      return `Password must be at least ${userError.minimumLength} characters.`;
    case "PASSWORD_TOO_LONG":
      return `Password must be at most ${userError.maximumLength} characters.`;
    case "PASSWORD_HAS_SURROUNDING_WHITESPACE":
      return "Password can't start or end with whitespace.";
    case "PASSWORD_TOO_COMMON":
      return "This password is too common. Please choose a different one.";
    case "USER_NOT_FOUND":
      return "No account exists with that username.";
    case "INVALID_CREDENTIALS":
      return "Incorrect username or password.";
    case "RATE_LIMITED":
      return `Too many attempts. Try again in ${Math.ceil((userError.retryAfterMs ?? 0) / 1000)} seconds.`;
    case "OTHER_ERROR":
      console.error("Auth failed:", userError.cause);
      return "Something went wrong. Please try again.";
    default:
      return `Unknown error: ${userError.error}`;
  }
}

function LogInForm() {
  const { signIn, pending } = useSignInWithPassword(
    api.auth.signInWithPassword,
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        void signIn({ username, password }).then((result) => {
          if (!result.success) {
            setError(passwordErrorMessage(result.userError));
          }
        });
      }}
    >
      <input
        className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="text"
        name="username"
        autoComplete="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={pending}
      />
      <input
        className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={pending}
      />
      <button
        className="bg-dark dark:bg-light text-light dark:text-dark rounded-md"
        type="submit"
        disabled={pending}
      >
        {pending ? "Logging in…" : "Sign in"}
      </button>
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
          <p className="text-dark dark:text-light font-mono text-xs">
            Error signing in: {error}
          </p>
        </div>
      )}
    </form>
  );
}

function SignUpForm() {
  const { signUp, pending } = useSignUpWithPassword(
    api.auth.signUpWithPassword,
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        void signUp({ username, password }).then((result) => {
          if (!result.success) {
            setError(passwordErrorMessage(result.userError));
          }
        });
      }}
    >
      <input
        className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="text"
        name="username"
        autoComplete="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={pending}
      />
      <input
        className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={pending}
      />
      <button
        className="bg-dark dark:bg-light text-light dark:text-dark rounded-md"
        type="submit"
        disabled={pending}
      >
        {pending ? "Creating account…" : "Sign up"}
      </button>
      {error && (
        <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
          <p className="text-dark dark:text-light font-mono text-xs">
            Error signing up: {error}
          </p>
        </div>
      )}
    </form>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <p>Welcome {viewer ?? "Anonymous"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        <button
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </button>
      </p>
      <p>
        Numbers:{" "}
        {numbers?.length === 0
          ? "Click the button!"
          : (numbers?.join(", ") ?? "...")}
      </p>
      <p>
        Edit{" "}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          convex/myFunctions.ts
        </code>{" "}
        to change your backend
      </p>
      <p>
        Edit{" "}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          src/App.tsx
        </code>{" "}
        to change your frontend
      </p>
    </div>
  );
}
