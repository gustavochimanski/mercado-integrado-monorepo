import { getCurrentUser } from "@/actions/auth/get-current-user"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Bem-vindo, {user?.username || "Usuário"}!</p>
    </div>
  )
}
