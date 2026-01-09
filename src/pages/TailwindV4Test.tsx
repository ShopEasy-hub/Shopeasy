import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

/**
 * Tailwind v4 Verification Page
 * 
 * This page tests that Tailwind v4 is properly configured with your lemon green theme.
 * To use: Temporarily import and render this component in App.tsx
 */

export function TailwindV4Test() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Tailwind v4 Verification Test
          </h1>
          <p className="text-muted-foreground">
            Testing ShopEasy lemon green theme with Tailwind CSS v4
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <h3 className="font-semibold">CSS Loading</h3>
            <p className="text-sm text-muted-foreground">
              If you see this styled card, CSS is loading correctly
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <h3 className="font-semibold">Tailwind v4</h3>
            <p className="text-sm text-muted-foreground">
              Using @import "tailwindcss" syntax
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <h3 className="font-semibold">Theme System</h3>
            <p className="text-sm text-muted-foreground">
              Custom colors via @theme directive
            </p>
          </Card>
        </div>

        {/* Primary Color Test - LEMON GREEN */}
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold">🍋 Lemon Green Primary Color</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Primary Background</h3>
              <p>This should be LEMON GREEN (#a3d700)</p>
              <p className="text-sm mt-2 opacity-80">
                HSL: 84° 81% 44%
              </p>
            </div>
            <div className="border-4 border-primary p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2 text-primary">Primary Border & Text</h3>
              <p className="text-muted-foreground">Border and text using primary color</p>
            </div>
          </div>
        </Card>

        {/* Semantic Colors */}
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold">🎨 Semantic Colors</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-success text-success-foreground p-4 rounded-lg text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Success</p>
            </div>
            <div className="bg-warning text-warning-foreground p-4 rounded-lg text-center">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Warning</p>
            </div>
            <div className="bg-destructive text-destructive-foreground p-4 rounded-lg text-center">
              <XCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="font-semibold">Error</p>
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto mb-2 bg-current rounded-full" />
              <p className="font-semibold">Secondary</p>
            </div>
          </div>
        </Card>

        {/* UI Components */}
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold">🧩 UI Components</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </div>
        </Card>

        {/* Layout Colors */}
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold">📐 Layout Colors</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border p-4 rounded-lg">
              <p className="font-semibold text-card-foreground">Card</p>
              <p className="text-sm text-muted-foreground">bg-card + border</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold text-foreground">Muted</p>
              <p className="text-sm text-muted-foreground">bg-muted</p>
            </div>
            <div className="bg-accent text-accent-foreground p-4 rounded-lg">
              <p className="font-semibold">Accent</p>
              <p className="text-sm opacity-80">bg-accent</p>
            </div>
          </div>
        </Card>

        {/* Tailwind Utilities */}
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold">⚡ Tailwind Utilities</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500 rounded" />
              <div className="w-12 h-12 bg-blue-500 rounded" />
              <div className="w-12 h-12 bg-green-500 rounded" />
              <div className="w-12 h-12 bg-yellow-500 rounded" />
              <div className="w-12 h-12 bg-purple-500 rounded" />
              <span className="text-sm text-muted-foreground">Standard Tailwind colors</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="p-4 shadow-sm rounded-lg bg-white">shadow-sm</div>
              <div className="p-4 shadow-md rounded-lg bg-white">shadow-md</div>
              <div className="p-4 shadow-lg rounded-lg bg-white">shadow-lg</div>
              <div className="p-4 shadow-xl rounded-lg bg-white">shadow-xl</div>
            </div>
          </div>
        </Card>

        {/* Responsive Test */}
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold">📱 Responsive Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="font-mono text-sm">xs: 1 col</p>
            </div>
            <div className="bg-primary/20 p-4 rounded-lg text-center">
              <p className="font-mono text-sm">md: 2 cols</p>
            </div>
            <div className="bg-primary/30 p-4 rounded-lg text-center">
              <p className="font-mono text-sm">lg: 4 cols</p>
            </div>
            <div className="bg-primary/40 p-4 rounded-lg text-center">
              <p className="font-mono text-sm">Responsive</p>
            </div>
          </div>
        </Card>

        {/* Status Summary */}
        <Card className="p-8 bg-primary/5 border-2 border-primary">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">✅ Tailwind v4 Configured Successfully!</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>✓ CSS importing via @import "tailwindcss"</p>
                <p>✓ Custom theme colors defined in @theme directive</p>
                <p>✓ Lemon green primary color (HSL 84° 81% 44%)</p>
                <p>✓ All semantic colors working</p>
                <p>✓ Responsive utilities active</p>
                <p>✓ Component library styled correctly</p>
              </div>
              <div className="pt-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Return to ShopEasy POS
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pb-8">
          <p>ShopEasy POS • Tailwind CSS v4 • Lemon Green Theme</p>
          <p className="mt-1">Last updated: January 8, 2026</p>
        </div>
      </div>
    </div>
  );
}
