"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TrashIcon from "~/components/hero-icons/TrashIcon"
import PlusIcon from "~/components/hero-icons/PlusIcon"
import { Tag } from "~/types/Tag"
import { TagType } from "~/types/TagType"
import { SettingTagBadge } from "~/components/custom/SettingTagBadge"

interface ExistingTagTypeCardProps {
  tagType: TagType
  tags: Tag[]
}

// Helper types for color handling
type RGB = { r: number; g: number; b: number }

// Color variation constants
const LIGHT_VARIATION_STEP = 20
const LIGHTER_VARIATION_STEP = 60
const DARK_VARIATION_STEP = 20
const DARKER_VARIATION_STEP = 60
const SATURATION_INCREASE = 0.4
const SATURATION_DECREASE = -0.4
const SATURATION_STRONG_INCREASE = 0.8

// Helper functions for color manipulation
const hexToRgb = (hex: string): RGB => {
  // Handle different hex formats
  const hexColor = hex.startsWith("#") ? hex.slice(1) : hex
  const validHex =
    hexColor.length === 3
      ? hexColor
          .split("")
          .map((c) => c + c)
          .join("") // Convert 3-char hex to 6-char
      : hexColor

  // Parse the hex values
  if (validHex.length === 6) {
    const r = parseInt(validHex.substring(0, 2), 16)
    const g = parseInt(validHex.substring(2, 4), 16)
    const b = parseInt(validHex.substring(4, 6), 16)

    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return { r, g, b }
    }
  }

  // Default gray color if parsing fails
  return { r: 128, g: 128, b: 128 }
}

const rgbToHex = (r: number, g: number, b: number): string => {
  // Ensure values are in valid range
  const validR = Math.max(0, Math.min(255, Math.round(r)))
  const validG = Math.max(0, Math.min(255, Math.round(g)))
  const validB = Math.max(0, Math.min(255, Math.round(b)))

  // Convert to hex format
  return (
    "#" +
    [
      validR.toString(16).padStart(2, "0"),
      validG.toString(16).padStart(2, "0"),
      validB.toString(16).padStart(2, "0"),
    ].join("")
  )
}

// Generate color variations
const generateColorVariations = (baseColor: string): string[] => {
  // Default to gray if no valid color provided
  const safeBaseColor = baseColor?.trim() || "#808080"

  // Get RGB values of the base color
  const rgb = hexToRgb(safeBaseColor)

  // Generate variations
  const variations: string[] = [
    // // Lighter variations
    // rgbToHex(
    //   Math.min(255, rgb.r + LIGHT_VARIATION_STEP),
    //   Math.min(255, rgb.g + LIGHT_VARIATION_STEP),
    //   Math.min(255, rgb.b + LIGHT_VARIATION_STEP),
    // ),
    // rgbToHex(
    //   Math.min(255, rgb.r + LIGHTER_VARIATION_STEP),
    //   Math.min(255, rgb.g + LIGHTER_VARIATION_STEP),
    //   Math.min(255, rgb.b + LIGHTER_VARIATION_STEP),
    // ),

    // // Darker variations
    // rgbToHex(
    //   Math.max(0, rgb.r - DARK_VARIATION_STEP),
    //   Math.max(0, rgb.g - DARK_VARIATION_STEP),
    //   Math.max(0, rgb.b - DARK_VARIATION_STEP),
    // ),
    // rgbToHex(
    //   Math.max(0, rgb.r - DARKER_VARIATION_STEP),
    //   Math.max(0, rgb.g - DARKER_VARIATION_STEP),
    //   Math.max(0, rgb.b - DARKER_VARIATION_STEP),
    // ),

    // // Saturation variations (using a simplified approach)
    // adjustSaturation(rgb, SATURATION_INCREASE),
    // adjustSaturation(rgb, SATURATION_DECREASE),
    // adjustSaturation(rgb, SATURATION_STRONG_INCREASE),

    adjustSaturation(rgb, -0.7),
    adjustSaturation(rgb, -0.5),
    adjustSaturation(rgb, -0.3),
    safeBaseColor, // Original color
    adjustSaturation(rgb, 0.3),
    adjustSaturation(rgb, 0.5),
    adjustSaturation(rgb, 0.7),
    adjustSaturation(rgb, 0.9),
  ]

  return variations
}

// Adjust saturation of a color
const adjustSaturation = (rgb: RGB, amount: number): string => {
  // const avg = (rgb.r + rgb.g + rgb.b) / 3
  const avg = 0
  return rgbToHex(
    Math.max(0, Math.min(255, rgb.r + (rgb.r - avg) * amount)),
    Math.max(0, Math.min(255, rgb.g + (rgb.g - avg) * amount)),
    Math.max(0, Math.min(255, rgb.b + (rgb.b - avg) * amount)),
  )
}

const ExistingTagTypeCard: React.FC<ExistingTagTypeCardProps> = ({ tagType, tags }) => {
  const [tag, setTag] = useState("")
  const defaultColor = "#808080"

  // Get base color from tagType, with fallback to default
  const baseColor =
    typeof tagType.color === "string" && tagType.color ? tagType.color : defaultColor

  const [selectedColor, setSelectedColor] = useState(baseColor)
  const [colorVariations, setColorVariations] = useState<string[]>([])
  const router = useRouter()

  // Generate color variations when tagType.color changes
  useEffect(() => {
    // Update color and variations when tagType.color changes
    const color = typeof tagType.color === "string" && tagType.color ? tagType.color : defaultColor
    setSelectedColor(color)
    setColorVariations(generateColorVariations(color))
  }, [tagType.color])

  const onAddTagTypeButtonClick = async () => {
    if (!tag.trim()) {
      toast.error("Please enter a tag name")
      return
    }

    const response = await fetch("/api/user/tag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagType: tagType.id, tag: tag, color: selectedColor }),
    })

    const json = await response.json()

    if (response.status === 400) {
      toast.error("Failed to add Tag.", {
        description: json.error,
      })
      return
    }

    router.refresh()
  }

  // console.log(tagType)
  // console.log(tags)

  // const onDeleteTagButtonClick = (tagId: string) => async () => {
  //   await fetch("/api/user/tag", {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ tagId: tagId }),
  //   })
  //   router.refresh()
  // }

  const onDeleteTagTypeButtonClick = (tagTypeId: string) => async () => {
    const response = await fetch("/api/user/tagType", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagTypeId: tagTypeId }),
    })

    const json = await response.json()

    if (response.status === 400) {
      toast.error("Failed to delete TagType.", {
        description: json.error,
      })
      return
    }

    router.refresh()
  }

  // console.log(tagType)
  // console.log(tags.filter((tag: Tag) => tag.type.id === tagType.id))

  return (
    <Card className="w-72 min-h-[340px] bg-gradient-to-br from-slate-800 to-gray-900 shadow-2xl rounded-2xl border border-slate-700 text-white flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: tagType.color }}
              ></span>
              {tagType.name}
            </CardTitle>
            <CardDescription className="text-slate-300 mt-1 mb-2 text-sm">
              {tagType.description}
            </CardDescription>
          </div>
          <button
            className="ml-2 p-2 rounded-full hover:bg-red-500/20 transition-colors"
            onClick={onDeleteTagTypeButtonClick(tagType.id)}
            title="Delete Tag Type"
          >
            <TrashIcon className="w-5 h-5 text-red-400 hover:text-red-600" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 mb-2">
        {tags
          .filter((tag: Tag) => tag.type.id === tagType.id)
          .map((tag: Tag) => (
            <SettingTagBadge key={tag.id} tagObject={tag} />
          ))}
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Input
            type="text"
            id="new-tag"
            placeholder="New Tag"
            className="rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-emerald-400 text-white flex-1"
            onChange={(e) => setTag(e.target.value)}
            value={tag}
          />
          <Button
            onClick={onAddTagTypeButtonClick}
            className="bg-emerald-500 hover:bg-emerald-600 rounded-lg px-3 py-2"
            title="Add Tag"
          >
            <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2 justify-between w-full">
          {colorVariations.map((color, index) => (
            <button
              key={index}
              type="button"
              className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === color ? "border-white scale-110" : "border-transparent"}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={`Color variation ${index + 1}`}
            />
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default ExistingTagTypeCard
