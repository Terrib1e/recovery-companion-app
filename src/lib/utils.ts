import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const calculateStreak = (checkIns: Date[]): number => {
  if (!checkIns.length) return 0
  
  const today = new Date()
  let streak = 0
  let currentDate = new Date(today)
  
  // Sort check-ins in descending order
  const sortedCheckIns = [...checkIns].sort((a, b) => b.getTime() - a.getTime())
  
  for (const checkIn of sortedCheckIns) {
    if (isSameDay(currentDate, checkIn)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (isYesterday(currentDate, checkIn)) {
      streak++
      currentDate = checkIn
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }
  
  return streak
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export const isYesterday = (today: Date, checkIn: Date): boolean => {
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(yesterday, checkIn)
}