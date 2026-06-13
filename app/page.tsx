// app/page.tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-500">
      <Card className="w-full max-w-md shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Project Overview
          </CardTitle>
          <CardDescription>
            Manage your application configurations and UI components here.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Your Next.js project is successfully configured with <strong>pnpm</strong>, 
            <strong>Tailwind v4</strong>, and <strong>shadcn/ui</strong>.
          </p>
          <div className="rounded-lg bg-muted p-3 font-mono text-xs text-foreground">
            pnpm dev
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center border-t border-border pt-4 mt-2">
          <span className="text-xs text-muted-foreground">v1.0.0</span>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Cancel</Button>
            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm">Deploy App</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to build and push to production</p>
              </TooltipContent>
            </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
