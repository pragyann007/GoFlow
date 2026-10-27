"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Network } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const navigationItems = [
    { href: "/dashboard/home", title: "Home", icon: Home },
    { href: "/dashboard/workflows", title: "Workflows", icon: Network },
  ]

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader  className="text-foreground flex justify-between p-4 font-bold tracking-tight border-b border-border">
       <Link href={"/"} >Go Flow</Link>

      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                // Checks if this tab matches the active URL path
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem  key={item.href}>
                    {/* asChild lets us pass next/link directly into the styled button */}
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className="w-full p-4 h-12 text-xs mb-4  font-medium"
                    >
                      <Link className="flex gap-4" href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t border-border text-[11px] text-muted-foreground text-center">
        v1.0.0
      </SidebarFooter>
    </Sidebar>
  )
}
