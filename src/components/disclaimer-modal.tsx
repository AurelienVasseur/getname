"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DisclaimerModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-muted-foreground hover:text-primary">
          Disclaimer
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Disclaimer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            The information provided by this service is for informational and indicative purposes only. 
            Although we use multiple data sources (WHOIS, DNS, etc.) to perform our checks, 
            we cannot guarantee 100% reliability.
          </p>
          <p className="text-sm text-muted-foreground">
            Our system performs checks based on:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>Domain WHOIS data</li>
            <li>DNS records</li>
            <li>Domain name ownership information</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            This data may be incomplete, inaccurate, or may not reflect the current situation. 
            We recommend that you always verify this information with official sources 
            or the relevant registrars.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 