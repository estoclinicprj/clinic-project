"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { 
  Bell, 
  Search, 
  Loader2, 
  AlertCircle, 
  User,
  Phone,
  Hash,
  Stethoscope,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Types
type Medecin = {
  id: number | string
  nom: string
  prenom: string
  specialite: string
  telephone: string
  email?: string
  statut: "Actif" | "Absent"
}

// Specialty color mapping
const specialtyColors: Record<string, { bg: string; text: string; border: string }> = {
  "Cardiologie": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  "Pédiatrie": { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30" },
  "Généraliste": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "Dermatologie": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "Neurologie": { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  "Orthopédie": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  "Ophtalmologie": { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  "Gynécologie": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  "Psychiatrie": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  "Radiologie": { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
}

const getSpecialtyColor = (specialite: string) => {
  return specialtyColors[specialite] || { 
    bg: "bg-gray-500/10", 
    text: "text-gray-400", 
    border: "border-gray-500/30" 
  }
}

// OOP MedecinManager class for data management
class MedecinManager {
  private medecins: Medecin[] = []
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async fetchMedecins(): Promise<Medecin[]> {
    const response = await fetch(this.apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`)
    }

    const data = await response.json()
    this.medecins = Array.isArray(data) ? data : data.medecins || []
    return this.medecins
  }

  getMedecins(): Medecin[] {
    return this.medecins
  }

  searchMedecins(query: string): Medecin[] {
    if (!query.trim()) {
      return this.medecins
    }

    const lowerQuery = query.toLowerCase().trim()
    
    return this.medecins.filter((medecin) => {
      const fullName = `${medecin.nom} ${medecin.prenom}`.toLowerCase()
      const reverseName = `${medecin.prenom} ${medecin.nom}`.toLowerCase()
      const specialite = medecin.specialite.toLowerCase()
      const id = String(medecin.id).toLowerCase()
      const telephone = medecin.telephone.toLowerCase()

      return (
        fullName.includes(lowerQuery) ||
        reverseName.includes(lowerQuery) ||
        specialite.includes(lowerQuery) ||
        id.includes(lowerQuery) ||
        telephone.includes(lowerQuery)
      )
    })
  }

  getMedecinCount(): number {
    return this.medecins.length
  }

  getActiveCount(): number {
    return this.medecins.filter(m => m.statut === "Actif").length
  }

  getAbsentCount(): number {
    return this.medecins.filter(m => m.statut === "Absent").length
  }
}

// Component
export default function ListeMedecinsPage() {
  const [medecins, setMedecins] = useState<Medecin[]>([])
  const [filteredMedecins, setFilteredMedecins] = useState<Medecin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCount, setActiveCount] = useState(0)
  const [absentCount, setAbsentCount] = useState(0)

  // Initialize MedecinManager
  const medecinManager = useMemo(
    () => new MedecinManager("api/get_medecins.php"),
    []
  )

  // Fetch medecins on mount
  useEffect(() => {
    const loadMedecins = async () => {
      try {
        const data = await medecinManager.fetchMedecins()
        setMedecins(data)
        setFilteredMedecins(data)
        setActiveCount(medecinManager.getActiveCount())
        setAbsentCount(medecinManager.getAbsentCount())
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du chargement des médecins."
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadMedecins()
  }, [medecinManager])

  // Live search filter
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      const results = medecinManager.searchMedecins(query)
      setFilteredMedecins(results)
    },
    [medecinManager]
  )

  return (
    <div className="dark min-h-screen bg-gray-900">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-100">Liste des Médecins</h2>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                {medecins.length} médecins
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-100">
              Gestion des Médecins
            </h1>
            <p className="mt-1 text-gray-400">
              Consultez et recherchez les médecins enregistrés dans le système
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Stethoscope className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{medecins.length}</p>
                  <p className="text-xs text-gray-400">Total Médecins</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{activeCount}</p>
                  <p className="text-xs text-gray-400">Actifs</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <User className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-100">{absentCount}</p>
                  <p className="text-xs text-gray-400">Absents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-700/50 bg-red-900/30 px-5 py-4 text-red-300">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Erreur de chargement</p>
                <p className="mt-0.5 text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Table Card */}
          <Card className="border-gray-800 bg-gray-800/50 shadow-xl">
            <CardHeader className="border-b border-gray-700 pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                    <Stethoscope className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-100">
                      Tous les Médecins
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                      {filteredMedecins.length} médecin{filteredMedecins.length !== 1 ? "s" : ""} trouvé{filteredMedecins.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Rechercher par nom ou spécialité..."
                    className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  <p className="mt-4 text-sm text-gray-400">Chargement des médecins...</p>
                </div>
              ) : filteredMedecins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
                    <Stethoscope className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-400">
                    {searchQuery ? "Aucun médecin trouvé" : "Aucun médecin enregistré"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {searchQuery 
                      ? "Essayez de modifier votre recherche" 
                      : "Les médecins apparaîtront ici une fois ajoutés"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700 bg-gray-800/50">
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            ID
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nom
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Spécialité
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Téléphone
                          </div>
                        </th>
                        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Statut
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {filteredMedecins.map((medecin, index) => {
                        const specialtyColor = getSpecialtyColor(medecin.specialite)
                        return (
                          <tr
                            key={medecin.id}
                            className="transition-colors hover:bg-gray-800/50"
                            style={{
                              animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                            }}
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className="inline-flex items-center justify-center rounded-lg bg-gray-700/50 px-3 py-1 text-sm font-mono font-medium text-gray-300">
                                #{String(medecin.id).padStart(4, "0")}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
                                  {medecin.prenom.charAt(0).toUpperCase()}
                                  {medecin.nom.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-100">
                                    Dr. {medecin.prenom} {medecin.nom}
                                  </p>
                                  {medecin.email && (
                                    <p className="text-xs text-gray-500">{medecin.email}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${specialtyColor.bg} ${specialtyColor.text} ${specialtyColor.border}`}>
                                {medecin.specialite}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className="text-sm text-gray-300">
                                {medecin.telephone}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {medecin.statut === "Actif" ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                  Actif
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                                  Absent
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer */}
              {!isLoading && filteredMedecins.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-700 px-6 py-4">
                  <p className="text-sm text-gray-400">
                    Affichage de{" "}
                    <span className="font-medium text-gray-100">
                      {filteredMedecins.length}
                    </span>{" "}
                    sur{" "}
                    <span className="font-medium text-gray-100">
                      {medecins.length}
                    </span>{" "}
                    médecins
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
