import { FloatingDock } from "../components/FloatingDock";
import {
  MapPlus,
  LayoutGrid,
  BrainCircuit,
  BotMessageSquare,
} from "lucide-react";

const dockItems = [
  { title: "Maps", icon: <MapPlus size={24} />, href: "/maps" },
  { title: "Home", icon: <LayoutGrid size={24} />, href: "/" },
  { title: "Model", icon: <BrainCircuit size={24} />, href: "/model" },
  { title: "Chatbot", icon: <BotMessageSquare size={24} />, href: "/chatbot" },
];

export default function FloatingDockItems() {
  return (
    <FloatingDock items={dockItems} desktopClassName="" mobileClassName="" />
  );
}
