"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Bell, Search, UserPlus, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type NotificationState = {
  type: "success" | "error"
  message: string
} | null

export default function AjouterPatientPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    sexe: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<NotificationState>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification(null)

    try {
      const response = await fetch("api/ajouter_patient.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          date_naissance: formData.dateNaissance,
          telephone: formData.telephone,
          sexe: formData.sexe,
        }),
      })

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Le patient a été enregistré avec succès dans le système.",
        })
        setFormData({
          nom: "",
          prenom: "",
          dateNaissance: "",
          telephone: "",
          sexe: "",
        })
      } else {
        const errorData = await response.json().catch(() => null)
        setNotification({
          type: "error",
          message:
            errorData?.message ||
            `Une erreur est survenue (code ${response.status}). Veuillez réessayer.`,
        })
      }
    } catch {
      setNotification({
        type: "error",
        message:
          "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setNotification(null), 6000)
    }
  }

  const isFormValid =
    formData.nom &&
    formData.prenom &&
    formData.dateNaissance &&
    formData.telephone &&
    formData.sexe

  return (
    <div className="dark min-h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-100">Ajouter Patient</h2>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                Nouveau Patient
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="h-10 w-64 rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
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
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-100">
              Enregistrer un nouveau patient
            </h1>
            <p className="mt-1 text-gray-400">
              Remplissez le formulaire ci-dessous pour ajouter un nouveau patient au système
            </p>
          </div>

          {/* Notification Banner */}
          {notification && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-xl border px-5 py-4 transition-all duration-300 ${
                notification.type === "success"
                  ? "border-green-700/50 bg-green-900/30 text-green-300"
                  : "border-red-700/50 bg-red-900/30 text-red-300"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {notification.type === "success" ? "Succès" : "Erreur"}
                </p>
                <p className="mt-0.5 text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto shrink-0 opacity-60 hover:opacity-100"
                aria-label="Fermer la notification"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Form Card */}
          <Card className="mx-auto max-w-2xl border-gray-800 bg-gray-800/50 shadow-xl">
            <CardHeader className="border-b border-gray-700 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <UserPlus className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-100">
                    Informations du Patient
                  </CardTitle>
                  <p className="text-sm text-gray-400">Tous les champs sont obligatoires</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Nom & Prénom */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-300">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Entrez le nom"
                      autoComplete="family-name"
                      className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-300">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="Entrez le prénom"
                      autoComplete="given-name"
                      className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Date de Naissance & Téléphone */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="dateNaissance"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Date de Naissance
                    </label>
                    <input
                      type="date"
                      id="dateNaissance"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-300">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="+33 6 12 34 56 78"
                      autoComplete="tel"
                      className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Sexe */}
                <div className="space-y-3">
                  <p className="block text-sm font-medium text-gray-300">Sexe</p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: "masculin", label: "Masculin" },
                      { value: "feminin", label: "Féminin" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-blue-500/50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10 has-[:checked]:text-blue-300"
                      >
                        <input
                          type="radio"
                          name="sexe"
                          value={option.value}
                          checked={formData.sexe === option.value}
                          onChange={handleInputChange}
                          className="h-4 w-4 border-gray-600 bg-gray-800 accent-blue-500"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="h-12 w-full bg-blue-600 text-base font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enregistrement en cours...
                      </span>
                    ) : (
                      "Enregistrer le Patient"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
