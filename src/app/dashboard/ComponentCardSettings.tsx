import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { CURRENCIES, FREQUENCIES } from "~/types/backend/CustomEnum"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { useState } from "react"
import { api } from "~/trpc/server"

interface ComponentCardSettingsProps {
  metadata: any
  onCurrencyChange: (value: "GBP" | "USD" | "EUR" | "RON") => void
  onFrequencyChange: (value: "daily" | "weekly" | "monthly" | "yearly") => void
}

const ComponentCardSettings: React.FC<ComponentCardSettingsProps> = ({
  metadata: { currency, frequency },
  onCurrencyChange,
  onFrequencyChange,
}) => {
  return (
    <Card className="w-128 h-32 bg-slate-50 shadow-lg rounded-xl bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="flex">
        <div className="w-2/10">
          <Select onValueChange={onCurrencyChange} defaultValue={currency}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem value={currency} key={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-3/10">
          <Select onValueChange={onFrequencyChange} defaultValue={frequency}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((frequency) => (
                <SelectItem value={frequency} key={frequency}>
                  {frequency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export default ComponentCardSettings
