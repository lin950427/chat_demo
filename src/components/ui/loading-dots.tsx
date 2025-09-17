import { cn } from '@/lib/utils'

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full bg-current animate-loading-dots"
          )}
          style={{
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}
