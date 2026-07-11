import { UtensilsCrossed, Car, ShoppingBag, Repeat, Clapperboard, Zap, HeartPulse, Home, Wallet, Package } from "lucide-react";

export const CATEGORIES = [
  "Food", "Transport", "Shopping", "Subscriptions", "Entertainment",
  "Utilities", "Healthcare", "Housing", "Income", "Other"
];

export const CATEGORY_COLORS = {
  Food: "#d99a6c", Transport: "#7ba7bc", Shopping: "#c98a9c",
  Subscriptions: "#a89bc4", Entertainment: "#c9a5c4", Utilities: "#8fb9ae",
  Healthcare: "#c68787", Housing: "#cbab7d", Income: "#8fae8a", Other: "#a3a3a3"
};

export const CATEGORY_ICON_COMPONENTS = {
  Food: UtensilsCrossed, Transport: Car, Shopping: ShoppingBag,
  Subscriptions: Repeat, Entertainment: Clapperboard, Utilities: Zap,
  Healthcare: HeartPulse, Housing: Home, Income: Wallet, Other: Package
};
