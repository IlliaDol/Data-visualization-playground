import React from 'react'
import { StoryPlayer } from '@/components/StoryPlayer'

// Generate static params for dynamic route
export async function generateStaticParams() {
  return []
}

export default function StoryPlayerPage({ params }: { params: { id: string } }) {
  return <StoryPlayer storyId={params.id} />
}
