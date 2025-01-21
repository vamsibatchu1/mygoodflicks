'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { listsService } from '@/lib/services/lists'
import { ListCard } from '@/components/lists/list-card'
import { CreateListModal } from '@/components/modals/create-list-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'

interface ListItem {
  id: string
  type: 'movie' | 'show'
  posterPath: string
  title: string
  addedAt: string
}

interface ListData {
  id: string
  name: string
  isPrivate: boolean
  userId: string
  items: ListItem[]
  createdAt: any
}

interface TransformedList {
  id: string
  name: string
  isPrivate: boolean
  movieCount: number
  showCount: number
  items: ListItem[]
}

export default function ListsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userId, setUserId] = useState<string | null>(auth.currentUser?.uid || null)
  const [lists, setLists] = useState<TransformedList[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        router.push('/auth')
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const fetchLists = async () => {
      if (!userId) return

      try {
        const data = await listsService.getUserLists(userId)
        
        const transformedData: TransformedList[] = data.map(list => ({
          id: list.id,
          name: list.name || 'Untitled List',
          isPrivate: list.isPrivate ?? true,
          movieCount: (list.items || []).filter(item => item.type === 'movie').length,
          showCount: (list.items || []).filter(item => item.type === 'show').length,
          items: list.items || []
        }))

        setLists(transformedData)
      } catch (error) {
        console.error('Error fetching lists:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLists()
  }, [userId])

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4 pl-12 pr-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search lists..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Create List
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!isLoading && filteredLists.map((list) => (
          <ListCard
            key={list.id}
            title={list.name}
            isPublic={!list.isPrivate}
            movieCount={list.movieCount}
            showCount={list.showCount}
            thumbnails={list.items
              .slice(0, 3)
              .map(item => item.posterPath)
              .filter((poster): poster is string => Boolean(poster))
            }
          />
        ))}
      </div>

      <CreateListModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
} 