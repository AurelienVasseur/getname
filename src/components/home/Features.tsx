import { Card } from "@/components/ui/card"
import { DisclaimerModal } from "@/components/disclaimer-modal"

export function Features() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Card className="p-6 col-span-1">
          <h3 className="font-semibold mb-2">Domain Names</h3>
          <p className="text-sm text-muted-foreground">
            Check availability on major extensions (.com, .net, .org, etc.)
          </p>
        </Card>
        <Card className="p-6 col-span-1">
          <h3 className="font-semibold mb-2">Social Networks</h3>
          <p className="text-sm text-muted-foreground">
            Find your name on Twitter, Instagram, Facebook and more
          </p>
        </Card>
        {/*
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Trademarks</h3>
          <p className="text-sm text-muted-foreground">
            Check if the name is already used as a registered trademark
          </p>
        </Card>
        */}
      </div>
      <div className="text-center">
        <DisclaimerModal />
      </div>
    </div>
  )
} 