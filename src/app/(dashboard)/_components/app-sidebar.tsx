"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconListDetails,
} from "@tabler/icons-react"

import { NavDocuments } from "@/src/app/(dashboard)/_components/nav-documents"
import { NavMain } from "@/src/app/(dashboard)/_components/nav-main"
import { NavSecondary } from "@/src/app/(dashboard)/_components/nav-secondary"
import { NavUser } from "@/src/app/(dashboard)/_components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar"

// import auth BetterAuth
import { authClient, useSession } from "@/lib/auth-client"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 const { data: session } = useSession()
  const [currentUser, setCurrentUser] = useState({
    name: "Loading...",
    email: "loading@example.com",
    avatar: "/avatars/shadcn.jpg",
  })

  useEffect(() => {
    if (session?.user) {
      setCurrentUser({
        name: session.user.name || "No Name",
        email: session.user.email,
        avatar: session.user.image || "/avatars/shadcn.jpg",
      })
    }
  }, [session])

  const data = {
    user: currentUser, 
    navMain: [
      { title: "Transaksi", url: "/admin/transaksi", icon: IconDashboard },
      { title: "Produk", url: "/admin/produk", icon: IconListDetails },
      { title: "Laporan", url: "/admin/laporan", icon: IconChartBar },
      { title: "Alert", url: "/admin/alert", icon: IconFolder },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          { title: "Active Proposals", url: "#" },
          { title: "Archived", url: "#" },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          { title: "Active Proposals", url: "#" },
          { title: "Archived", url: "#" },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          { title: "Active Proposals", url: "#" },
          { title: "Archived", url: "#" },
        ],
      },
    ],
    navSecondary: [],
    documents: [],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center gap-2 h-20">
              <Image
                src="/assets/images/navbar/Logo WarungKu.png"
                alt="WarungKu"
                width={80}
                height={80}
                loading="lazy"
                className="w-20 h-20 object-contain"
              />  
              <a href="#">
                <span className="text-2xl font-semibold">WarungKu</span>
              </a>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}