import { cn } from '@/lib/utils'

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-1 h-1 rounded-full animate-bounce bg-white"
          )}
          style={{
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}
