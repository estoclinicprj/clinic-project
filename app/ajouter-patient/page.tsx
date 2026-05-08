"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Bell, Search, UserPlus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AjouterPatientPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    sexe: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        nom: "",
        prenom: "",
        dateNaissance: "",
        telephone: "",
        sexe: "",
      })
    }, 3000)
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
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="h-10 w-64 rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-gray-400 hover:bg-gray-800 hover:text-gray-100">
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
                  <p className="text-sm text-gray-400">
                    Tous les champs sont obligatoires
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-100">
                    Patient enregistré avec succès
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Le nouveau patient a été ajouté au système
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom & Prénom Row */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Nom */}
                    <div className="space-y-2">
                      <label
                        htmlFor="nom"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Nom
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Entrez le nom"
                        className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Prénom */}
                    <div className="space-y-2">
                      <label
                        htmlFor="prenom"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        placeholder="Entrez le prénom"
                        className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Date de Naissance & Téléphone Row */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Date de Naissance */}
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

                    {/* Téléphone */}
                    <div className="space-y-2">
                      <label
                        htmlFor="telephone"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="+33 6 12 34 56 78"
                        className="h-11 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Sexe Radio Buttons */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Sexe
                    </label>
                    <div className="flex gap-6">
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 transition-colors hover:border-blue-500/50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10">
                        <input
                          type="radio"
                          name="sexe"
                          value="masculin"
                          checked={formData.sexe === "masculin"}
                          onChange={handleInputChange}
                          className="h-4 w-4 border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-sm font-medium text-gray-200">Masculin</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 transition-colors hover:border-blue-500/50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10">
                        <input
                          type="radio"
                          name="sexe"
                          value="feminin"
                          checked={formData.sexe === "feminin"}
                          onChange={handleInputChange}
                          className="h-4 w-4 border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="text-sm font-medium text-gray-200">Féminin</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="h-12 w-full bg-blue-600 text-base font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
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
                          Enregistrement...
                        </span>
                      ) : (
                        "Enregistrer le Patient"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
