export interface PortraitFrame {
  label: string;
  caption: string;
  image: string;
  accent?: string;
}

export const portraits: PortraitFrame[] = [
  {
    label: "Cricket",
    caption: "Daily practice teaches focus.",
    image: "/me/cricket.jpg",
  },
  {
    label: "Travel",
    caption: "New environments, sharper eyes.",
    image: "/me/travel.jpg",
  },
  {
    label: "Gym",
    caption: "A space for reset.",
    image: "/me/gym.jpg",
  },
  {
    label: "Capstone",
    caption: "Thermal illusions on the wrist.",
    image: "/me/capstone.jpg",
  },
  {
    label: "Books",
    caption: "Currently: Ruined by Design.",
    image: "/me/books.jpg",
  },
  {
    label: "Coffee",
    caption: "Pour-over before any decision.",
    image: "/me/coffee.jpg",
  },
];
