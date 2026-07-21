'use client'

import { useEffect } from 'react'
import { Images } from 'lucide-react'
import AlbumAdmin from './AlbumAdmin'
import AlbumGrid from './AlbumGrid'
import AlbumToolbar from './AlbumToolbar'
import { useAlbumStore } from '@/stores/album-store'

export default function AlbumWorkspace() {
  const enterEditMode = useAlbumStore((state) => state.enterEditMode)
  const exitEditMode = useAlbumStore((state) => state.exitEditMode)

  useEffect(() => {
    enterEditMode()
    return () => exitEditMode()
  }, [enterEditMode, exitEditMode])

  return (
    <div className="py-4">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">管理工作台</p>
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <Images className="h-7 w-7 text-primary" aria-hidden="true" />
            相册管理
          </h1>
          <p className="mt-2 text-base-content/75">新建、排序和维护相册内容，保存后同步到远端仓库。</p>
        </div>
        <AlbumToolbar />
      </header>
      <AlbumGrid />
      <AlbumAdmin />
    </div>
  )
}
