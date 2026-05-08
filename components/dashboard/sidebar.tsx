"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  UserPlus,
  Stethoscope,
  Users,
  ClipboardPlus,
  UserCheck,
  CalendarCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Tableau de bord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Ajouter Patient",
    href: "/ajouter-patient",
    icon: UserPlus,
  },
  {
    label: "Ajouter Médecin",
    href: "/ajouter-medecin",
    icon: Stethoscope,
  },
  {
    label: "Liste des Medecins",
    href: "/liste-medecins",
    icon: UserCheck,
  },
  {
    label: "Nouvelle Consultation",
    href: "/nouvelle-consultation",
    icon: ClipboardPlus,
  },
  {
    label: "Consultations du Jour",
    href: "/consultations-du-jour",
    icon: CalendarCheck,
  },
  {
    label: "Liste des Patients",
    href: "/liste-patients",
    icon: Users,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">MediCare</h1>
            <p className="text-xs text-sidebar-muted">Clinique Médicale</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-sidebar-primary" : "text-sidebar-muted"
                )} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
              <span className="text-sm font-medium text-sidebar-foreground">AD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
              <p className="text-xs text-sidebar-muted">admin@medicare.fr</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
