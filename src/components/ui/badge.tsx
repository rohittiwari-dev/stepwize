import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent shadow-neon shadow-primary/20",
        secondary:
          "bg-linear-to-r from-[var(--secondary-btn-start)] to-[var(--secondary-btn-end)] text-[var(--secondary-btn-text)] border-transparent shadow-xs hover:shadow-neon hover:shadow-primary/20 transition-all",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/30 [a]:hover:shadow-neon [a]:hover:shadow-destructive/20 transition-all",
        outline:
          "border-border/50 text-foreground bg-background/20 backdrop-blur-sm [a]:hover:bg-primary/20 [a]:hover:text-primary [a]:hover:border-primary/50 [a]:hover:shadow-neon [a]:hover:shadow-primary/20 transition-all",
        ghost:
          "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-all",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
