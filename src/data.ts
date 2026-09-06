// ponytail: static mock data, replace with Convex queries when the backend lands
export type EventType = "Trip" | "Milestone" | "Everyday" | "Other";

export type Moment = {
  id: string;
  photo: string;
  takenAt: string;
  message: string;
};

export type Event = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location?: string;
  moments: Moment[];
};

const pic = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

export const eventTypes: EventType[] = ["Trip", "Milestone", "Everyday", "Other"];

export const events: Event[] = [
  {
    id: "paris",
    title: "Paris in the rain",
    type: "Trip",
    date: "2026-08-14",
    location: "Paris, France",
    moments: [
      { id: "p1", photo: pic("paris1"), takenAt: "2026-08-14 09:12", message: "Croissants before the crowds." },
      { id: "p2", photo: pic("paris2"), takenAt: "2026-08-14 15:40", message: "Got caught in the rain near Pont Neuf." },
      { id: "p3", photo: pic("paris3"), takenAt: "2026-08-15 20:05", message: "Last night. Didn't want to leave." },
    ],
  },
  {
    id: "keys",
    title: "Got the keys",
    type: "Milestone",
    date: "2026-07-02",
    location: "Home",
    moments: [
      { id: "k1", photo: pic("keys1"), takenAt: "2026-07-02 11:00", message: "First time opening our own front door." },
      { id: "k2", photo: pic("keys2"), takenAt: "2026-07-02 18:30", message: "Pizza on the floor. No furniture yet." },
    ],
  },
  {
    id: "sunday",
    title: "Slow Sunday",
    type: "Everyday",
    date: "2026-06-21",
    moments: [
      { id: "s1", photo: pic("sunday1"), takenAt: "2026-06-21 08:45", message: "Coffee, book, cat." },
    ],
  },
  {
    id: "marathon",
    title: "First half marathon",
    type: "Milestone",
    date: "2026-05-10",
    location: "Amman",
    moments: [
      { id: "m1", photo: pic("run1"), takenAt: "2026-05-10 06:10", message: "Nervous at the start line." },
      { id: "m2", photo: pic("run2"), takenAt: "2026-05-10 08:32", message: "2:21. Legs gone. Worth it." },
    ],
  },
];

export const user = { username: "sara", joined: "2026-09-04", customTypes: ["Recipes"] };
