import { signIn, signOut, auth } from "@/auth"

export async function SignIn({
  provider,
  children,
  ...props
}: { provider?: string; children?: React.ReactNode } & React.ComponentPropsWithRef<"button">) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider)
      }}
    >
      <button {...props}>
        {children || `Sign In ${provider ? `with ${provider}` : ""}`}
      </button>
    </form>
  )
}

export async function SignOut({
  children,
  ...props
}: { children?: React.ReactNode } & React.ComponentPropsWithRef<"button">) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
      className="w-full"
    >
      <button className="w-full text-left" {...props}>
        {children || "Sign Out"}
      </button>
    </form>
  )
}
