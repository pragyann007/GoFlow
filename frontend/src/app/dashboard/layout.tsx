import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { RouteGuard } from "@/components/RouteGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  //  <RouteGuard>
     <SidebarProvider>
      <div className="flex h-screen w-screen bg-background overflow-hidden">
        
        {/* The sidebar is declared once here globally */}
        <AppSidebar />
        
        {/* Application Page Window Wrapper */}
        <main className="flex-1 flex flex-col min-w-0">
          
          
          {/* Active child routes render dynamically within this pane */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>

      </div>
    </SidebarProvider>
  //  </RouteGuard>
  )
}
