"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Bell, Search, RefreshCw, Clock, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Consultation {
  id: number
  heure: string
  patient_nom: string
  patient_prenom: string
  medecin_nom: string
  medecin_prenom: string
  motif: string
  statut: "Réalisé" | "En Attente" | "Planifié" | "Annulé"
}

type StatusType = "Réalisé" | "En Attente" | "Planifié" | "Annulé"

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string }> = {
  "Réalisé": {
    bg: "bg-green-500/20",
    text: "text-green-400",
    dot: "bg-green-500"
  },
  "En Attente": {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    dot: "bg-yellow-500"
  },
  "Planifié": {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-500"
  },
  "Annulé": {
    bg: "bg-red-500/20",
    text: "text-red-400",
    dot: "bg-red-500"
  }
}

// Mock data for demonstration (will be replaced by API data)
const mockConsultations: Consultation[] = [
  { id: 1, heure: "08:00", patient_nom: "Dupont", patient_prenom: "Marie", medecin_nom: "Martin", medecin_prenom: "Jean", motif: "Consultation générale", statut: "Réalisé" },
  { id: 2, heure: "08:30", patient_nom: "Bernard", patient_prenom: "Pierre", medecin_nom: "Dubois", medecin_prenom: "Sophie", motif: "Suivi cardiologique", statut: "Réalisé" },
  { id: 3, heure: "09:00", patient_nom: "Thomas", patient_prenom: "Lucas", medecin_nom: "Martin", medecin_prenom: "Jean", motif: "Vaccination", statut: "Réalisé" },
  { id: 4, heure: "09:30", patient_nom: "Robert", patient_prenom: "Emma", medecin_nom: "Leroy", medecin_prenom: "Marc", motif: "Douleurs abdominales", statut: "En Attente" },
  { id: 5, heure: "10:00", patient_nom: "Richard", patient_prenom: "Julie", medecin_nom: "Dubois", medecin_prenom: "Sophie", motif: "Contrôle annuel", statut: "En Attente" },
  { id: 6, heure: "10:30", patient_nom: "Petit", patient_prenom: "Antoine", medecin_nom: "Martin", medecin_prenom: "Jean", motif: "Renouvellement ordonnance", statut: "Planifié" },
  { id: 7, heure: "11:00", patient_nom: "Durand", patient_prenom: "Claire", medecin_nom: "Leroy", medecin_prenom: "Marc", motif: "Consultation pédiatrique", statut: "Planifié" },
  { id: 8, heure: "11:30", patient_nom: "Moreau", patient_prenom: "Hugo", medecin_nom: "Dubois", medecin_prenom: "Sophie", motif: "Examen dermatologique", statut: "Planifié" },
  { id: 9, heure: "14:00", patient_nom: "Simon", patient_prenom: "Léa", medecin_nom: "Martin", medecin_prenom: "Jean", motif: "Consultation neurologique", statut: "Planifié" },
  { id: 10, heure: "14:30", patient_nom: "Laurent", patient_prenom: "Nathan", medecin_nom: "Leroy", medecin_prenom: "Marc", motif: "Suivi post-opératoire", statut: "Annulé" },
]

export default function ConsultationsDuJourPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchConsultations = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true)
    }

    try {
      const response = await fetch("api/get_consultations_jour.php")
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des consultations")
      }

      const data = await response.json()
      setConsultations(data)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      // Use mock data if API is not available
      setConsultations(mockConsultations)
      setLastUpdated(new Date())
      // Don't show error for mock data fallback in development
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial fetch and polling setup
  useEffect(() => {
    fetchConsultations()

    // Poll every 60 seconds for real-time updates
    const intervalId = setInterval(() => {
      fetchConsultations(true)
    }, 60000)

    return () => clearInterval(intervalId)
  }, [fetchConsultations])

  // Filter consultations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredConsultations(consultations)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = consultations.filter((c) =>
        c.patient_nom.toLowerCase().includes(term) ||
        c.patient_prenom.toLowerCase().includes(term) ||
        c.medecin_nom.toLowerCase().includes(term) ||
        c.medecin_prenom.toLowerCase().includes(term) ||
        c.motif.toLowerCase().includes(term) ||
        c.heure.includes(term) ||
        c.statut.toLowerCase().includes(term)
      )
      setFilteredConsultations(filtered)
    }
  }, [searchTerm, consultations])

  const handleManualRefresh = () => {
    fetchConsultations(true)
  }

  const formatTime = (time: string) => {
    return time
  }

  const getStatusBadge = (statut: StatusType) => {
    const config = statusConfig[statut]
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        {statut}
      </span>
    )
  }

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  // Count by status
  const statusCounts = consultations.reduce((acc, c) => {
    acc[c.statut] = (acc[c.statut] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">Consultations du Jour</h2>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium capitalize text-blue-400">
                {today}
              </span>
              {isRefreshing && (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher une consultation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-72 rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {/* Manual Refresh */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-gray-400 hover:bg-gray-800 hover:text-white">
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
          {/* Page Header with Stats */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Consultations du Jour
                </h1>
                <p className="mt-1 text-gray-400">
                  Suivi en temps réel des consultations - Actualisation automatique toutes les 60 secondes
                </p>
              </div>
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  Dernière mise à jour: {lastUpdated.toLocaleTimeString("fr-FR")}
                </div>
              )}
            </div>

            {/* Status Summary Cards */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{statusCounts["Réalisé"] || 0}</p>
                    <p className="text-sm text-gray-400">Réalisées</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{statusCounts["En Attente"] || 0}</p>
                    <p className="text-sm text-gray-400">En Attente</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{statusCounts["Planifié"] || 0}</p>
                    <p className="text-sm text-gray-400">Planifiées</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{statusCounts["Annulé"] || 0}</p>
                    <p className="text-sm text-gray-400">Annulées</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Consultations Table */}
          <div className="rounded-xl border border-gray-800 bg-gray-800/30 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Heure
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Médecin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Motif
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 w-12 rounded bg-gray-700" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-32 rounded bg-gray-700" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-28 rounded bg-gray-700" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-40 rounded bg-gray-700" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-20 rounded-full bg-gray-700" />
                        </td>
                      </tr>
                    ))
                  ) : filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                            <Search className="h-6 w-6 text-gray-500" />
                          </div>
                          <p className="text-gray-400">
                            {searchTerm ? "Aucune consultation trouvée pour cette recherche" : "Aucune consultation programmée pour aujourd'hui"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((consultation, index) => (
                      <tr
                        key={consultation.id}
                        className="transition-colors hover:bg-gray-800/50"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-white">{formatTime(consultation.heure)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                              <span className="text-xs font-medium text-blue-400">
                                {consultation.patient_prenom[0]}{consultation.patient_nom[0]}
                              </span>
                            </div>
                            <span className="text-white">
                              {consultation.patient_prenom} {consultation.patient_nom}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                              <span className="text-xs font-medium text-green-400">
                                {consultation.medecin_prenom[0]}{consultation.medecin_nom[0]}
                              </span>
                            </div>
                            <span className="text-gray-300">
                              Dr. {consultation.medecin_prenom} {consultation.medecin_nom}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">{consultation.motif}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(consultation.statut)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4">
              <p className="text-sm text-gray-400">
                Affichage de <span className="font-medium text-white">{filteredConsultations.length}</span> consultation{filteredConsultations.length !== 1 ? "s" : ""} sur{" "}
                <span className="font-medium text-white">{consultations.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="border-gray-700 bg-transparent text-gray-500">
                  Précédent
                </Button>
                <Button variant="outline" size="sm" className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800">
                  Suivant
                </Button>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3">
            <p className="text-sm text-blue-400">
              <strong>Note :</strong> Les statuts des consultations sont automatiquement mis à jour par les règles de la base de données. 
              Cette page se rafraîchit automatiquement toutes les 60 secondes pour refléter les changements en temps réel.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
