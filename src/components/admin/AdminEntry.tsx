'use client'

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowLeft, KeyRound, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { useAuthStore } from '@/components/write/hooks/use-auth'

const WritePage = lazy(() => import('@/components/write/WritePage'))
const ConfigPage = lazy(() => import('@/components/write/ConfigPage').then((module) => ({ default: module.ConfigPage })))
const NavEditPage = lazy(() => import('@/components/write/NavEditPage'))
const FriendsEditPage = lazy(() => import('@/components/write/FriendsEditPage'))
const ProjectsEditPage = lazy(() => import('@/components/write/ProjectsEditPage'))
const AboutEditCode = lazy(() => import('@/components/write/AboutEditCode'))
const AlbumWorkspace = lazy(() => import('@/components/admin/AlbumWorkspace'))

type Props = {
  section: 'write' | 'config' | 'navigation' | 'friends' | 'projects' | 'about' | 'albums'
  categories?: string[]
  initialNavData?: any[]
  initialFriends?: any[]
  initialProjects?: any[]
  initialCode?: string
  serverPlaylists?: string
  configYaml?: string
}

const sectionNames: Record<Props['section'], string> = {
  write: '文章写作',
  config: '站点配置',
  navigation: '导航管理',
  friends: '友链管理',
  projects: '项目管理',
  about: '关于页面',
  albums: '相册管理',
}

export default function AdminEntry(props: Props) {
  const { isAuth, setPrivateKey, refreshAuthState } = useAuthStore()
  const [checking, setChecking] = useState(true)
  const keyInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.resolve(refreshAuthState()).finally(() => setChecking(false))
  }, [refreshAuthState])

  if (props.section === 'config' && typeof window !== 'undefined') {
    window.__SERVER_PLAYLISTS__ = JSON.parse(props.serverPlaylists || '[]')
    window.__SERVER_CONFIG__ = props.configYaml || ''
  }

  const importKey = async (file?: File) => {
    if (!file) return
    try {
      await setPrivateKey(await file.text())
      toast.success('管理工作台已解锁')
    } catch (error) {
      console.error(error)
      toast.error('密钥导入失败，请检查文件后重试')
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" offset={96} />
      {checking ? (
        <div className="flex min-h-[55vh] items-center justify-center text-base-content/70">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
          正在检查工作台授权…
        </div>
      ) : isAuth ? (
        <Suspense fallback={<WorkspaceLoading name={sectionNames[props.section]} />}>
          <Workspace {...props} />
        </Suspense>
      ) : (
        <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-16">
          <section className="w-full rounded-2xl border border-base-content/15 bg-base-100/90 p-8 text-center shadow-lg md:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LockKeyhole className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-xs font-semibold text-base-content/75">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              作者专用区域
            </p>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{sectionNames[props.section]}已锁定</h1>
            <p className="mx-auto mt-4 max-w-md leading-7 text-base-content/75">
              这里包含站点编辑与发布能力。导入管理员密钥后，才会在本次浏览器会话中加载工作区。
            </p>

            <input
              ref={keyInputRef}
              type="file"
              accept=".pem"
              className="hidden"
              onChange={async (event) => {
                await importKey(event.target.files?.[0])
                event.currentTarget.value = ''
              }}
            />
            <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" className="btn btn-primary gap-2 rounded-xl px-6" onClick={() => keyInputRef.current?.click()}>
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                导入管理员密钥
              </button>
              <a href="/" className="btn btn-ghost gap-2 rounded-xl">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                返回首页
              </a>
            </div>
            <p className="mt-5 text-xs leading-5 text-base-content/60">
              公共页面仅提供浏览功能，不会显示编辑、上传或发布按钮。
            </p>
          </section>
        </main>
      )}
    </>
  )
}

function Workspace(props: Props) {
  switch (props.section) {
    case 'write':
      return <WritePage categories={props.categories} />
    case 'config':
      return <ConfigPage />
    case 'navigation':
      return <NavEditPage initialNavData={props.initialNavData} />
    case 'friends':
      return <FriendsEditPage initialFriends={props.initialFriends} />
    case 'projects':
      return <ProjectsEditPage initialProjects={props.initialProjects} />
    case 'about':
      return <AboutEditCode initialCode={props.initialCode || ''} />
    case 'albums':
      return <AlbumWorkspace />
  }
}

function WorkspaceLoading({ name }: { name: string }) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center text-base-content/70">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
      正在加载{name}…
    </div>
  )
}

declare global {
  interface Window {
    __SERVER_PLAYLISTS__?: unknown[]
    __SERVER_CONFIG__?: string
  }
}
