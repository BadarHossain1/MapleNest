"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, isLoaded, setActive } = useSignIn()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!isLoaded || !signIn) {
      setIsLoading(false)
      return
    }

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/")
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.errors?.[0]?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      })
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError(err.errors?.[0]?.message || "Google sign-in failed. Please try again.")
      setIsLoading(false)
    }
  }

  const handleFacebookSignIn = async () => {
    if (!isLoaded || !signIn) return

    try {
      setIsLoading(true)
      await signIn.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      })
    } catch (err) {
      console.error("Facebook sign-in error:", err)
      setError(err.errors?.[0]?.message || "Facebook sign-in failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fef8f7] to-[#f2c9c7]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-[#f2c9c7] hover:text-[#edb3b0] mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="glass animate-fade-in">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src="/elaroseLogo.png"
                alt="ElaRose Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
            
            <CardTitle className="text-2xl font-bold text-[#2d1b1e]">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to your ElaRose account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 hover:bg-[#f2c9c7]/10"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 hover:bg-[#f2c9c7]/10"
                onClick={handleFacebookSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3 fill-[#1877f2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#f2c9c7] hover:text-[#edb3b0] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#f2c9c7] hover:bg-[#edb3b0] text-[#2d1b1e] font-semibold hover-glow"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#f2c9c7] hover:text-[#edb3b0] font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-[#f2c9c7] hover:text-[#edb3b0] transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#f2c9c7] hover:text-[#edb3b0] transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}