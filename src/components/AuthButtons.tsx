import { signInAction, signOutAction } from "@/lib/auth-actions"

export function SignIn({
  provider,
  children,
  ...props
}: { provider?: string; children?: React.ReactNode } & React.ComponentPropsWithRef<"button">) {
  return (
    <form action={() => signInAction(provider)}>
      <button {...props}>
        {children || `Sign In ${provider ? `with ${provider}` : ""}`}
      </button>
    </form>
  )
}

export function SignOut({
  children,
  ...props
}: { children?: React.ReactNode } & React.ComponentPropsWithRef<"button">) {
  return (
    <form action={signOutAction} className="w-full">
      <button className="w-full text-left" {...props}>
        {children || "Sign Out"}
      </button>
    </form>
  )
}
