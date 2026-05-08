import { Sidebar } from "@/components/dashboard/sidebar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { ConsultationsTable } from "@/components/dashboard/consultations-table"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">Tableau de Bord</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Bienvenue, Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="h-10 w-64 rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex h-full flex-col p-4">
          {/* Welcome Section */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Bonjour, bienvenue sur votre tableau de bord
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Voici un aperçu de votre activité médicale pour aujourd&apos;hui
            </p>
          </div>

          {/* Stats Cards */}
          <section className="mb-4 hidden">
            <StatCards />
          </section>

          {/* Consultations Table */}
          <section className="flex-1 overflow-auto">
            <ConsultationsTable />
          </section>
        </div>
      </main>
    </div>
  )
}
