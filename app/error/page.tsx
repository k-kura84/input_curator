export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="mt-2 text-muted-foreground">Sorry, something went wrong with the authentication process.</p>
      <a href="/login" className="mt-4 text-primary hover:underline">Back to Login</a>
    </div>
  )
}
