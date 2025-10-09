import { OrbitalLoader } from '@/components/ui/orbital-loader'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-black/30">
      <div className="flex flex-col items-center gap-6">
        {/* Loader Orbital - 3 círculos orbitando */}
        <OrbitalLoader />
      </div>
    </div>
  )
}
