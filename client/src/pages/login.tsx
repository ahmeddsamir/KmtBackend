import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Valid email address is required").min(1, "Email address is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, error, loading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    console.log("Login form submitted with:", data);
    
    // Ensure the input is a valid email
    if (!data.username.includes('@')) {
      setFormError("Please enter a valid email address");
      return;
    }
    
    try {
      await login(data.username, data.password);
      console.log("Login function completed");
    } catch (err: any) {
      console.error("Login error caught in form:", err);
      setFormError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <Card className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">KMT HR Management System</h1>
            <p className="text-neutral-600 mt-2">Sign in to access your dashboard</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="example@kmt.com" 
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-neutral-700">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-light">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              {(error || formError) && (
                <Alert variant="destructive" className="text-sm text-center">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || formError}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
