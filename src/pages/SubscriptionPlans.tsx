import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, ArrowLeft } from 'lucide-react';
import { AppState, Page } from '../App';
import { getAllPlans } from '../config/pricing';

interface SubscriptionPlansProps {
  appState: AppState;
  onNavigate: (page: Page) => void;
  onSelectPlan?: (planId: string) => void;
}

export function SubscriptionPlans({ appState, onNavigate, onSelectPlan }: SubscriptionPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const plans = getAllPlans();

  function handleChoosePlan(planId: string) {
    setSelectedPlan(planId);
    
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNavigate('dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Choose Your Plan</h1>
            <p className="text-sm text-muted-foreground">
              Select the perfect plan for your business
            </p>
          </div>
        </div>
      </header>

      {/* Plans Grid */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="mb-2">Flexible Plans for Every Business Size</h2>
          <p className="text-muted-foreground">
            All plans include a 30-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                plan.popular ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() => handleChoosePlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Plan Header */}
                <div>
                  <div className={`w-12 h-12 rounded-lg ${plan.color} mb-4 flex items-center justify-center`}>
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <h3 className="mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="border-t border-b py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl text-primary">{plan.displayPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent double-click when clicking button
                    handleChoosePlan(plan.id);
                  }}
                >
                  Choose Plan
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-4">
          <div className="bg-muted/50 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              All plans include access to our core POS features, secure cloud storage, 
              and regular updates. You can upgrade, downgrade, or cancel anytime.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Compare All Features</a>
            <a href="#" className="hover:text-primary">Contact Sales</a>
            <a href="#" className="hover:text-primary">FAQ</a>
          </div>
        </div>
      </div>
    </div>
  );
}
