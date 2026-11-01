import { redirect } from "next/navigation";

export default function DashboardRootPage() {
    // Instantly redirects anyone visiting /dashboard to your workflows page
    redirect("/dashboard/workflows"); // Make sure this matches your actual workflows route!
}