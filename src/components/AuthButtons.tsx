import { signIn, signOut, auth } from "@/auth"

export async function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<"button">) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider)
      }}
    >
      <button {...props}>Sign In {provider ? `with ${provider}` : ""}</button>
    </form>
  )
}

export async function SignOut(props: React.ComponentPropsWithRef<"button">) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
      className="w-full"
    >
      <button className="w-full text-left" {...props}>
        Sign Out
      </button>
    </form>
  )
}
