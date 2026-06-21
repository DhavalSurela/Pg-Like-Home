import { redirect } from "next/navigation";

// Blocks management was merged into the unified "Rooms" tab.
export default function BlocksPage() {
  redirect("/admin/rooms");
}
