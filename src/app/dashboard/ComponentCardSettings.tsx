import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { CURRENCIES } from "~/server/db/schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { useState } from "react"

interface ComponentCardSettingsProps {
  onCurrencyChange: (value: "" | "GBP" | "USD" | "EUR" | "RON") => void
}

const ComponentCardSettings: React.FC<ComponentCardSettingsProps> = ({ onCurrencyChange }) => {
  return (
    <Card className="w-64 h-64 bg-slate-50 shadow-lg rounded-xl bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={onCurrencyChange} defaultValue={"GBP"}>
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
      </CardContent>
    </Card>
  )
}

export default ComponentCardSettings
