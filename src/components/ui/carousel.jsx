"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

export function Carousel({ children, className }) {
  return <div className={cn("relative overflow-hidden", className)}>{children}</div>
}

export function CarouselContent({ children, className }) {
  return <div className={cn("flex transition-transform duration-300", className)}>{children}</div>
}

export function CarouselItem({ children, className }) {
  return <div className={cn("flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2", className)}>{children}</div>
}

export function CarouselPrevious({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn("absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full", className)}
    >
      <ChevronLeft className="h-5 w-5 text-gray-700" />
    </button>
  )
}

export function CarouselNext({ onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn("absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full", className)}
    >
      <ChevronRight className="h-5 w-5 text-gray-700" />
    </button>
  )
}
