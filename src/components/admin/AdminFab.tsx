import { useRef, useState } from 'react'
import {
  FolderKanban,
  Images,
  KeyRound,
  LockKeyhole,
  LogOut,
  Menu,
  PenLine,
  Settings2,
  UserRoundPen,
  Users,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/components/write/hooks/use-auth'

const adminLinks = [
  { href: '/write', label: '写文章', icon: PenLine },
  { href: '/config', label: '站点配置', icon: Settings2 },
  { href: '/navigation', label: '导航管理', icon: Menu },
  { href: '/friend', label: '友链管理', icon: Users },
  { href: '/projects-edit', label: '项目管理', icon: FolderKanban },
  { href: '/about-edit', label: '关于页面', icon: UserRoundPen },
  { href: '/album', label: '相册管理', icon: Images },
]

export default function AdminFab() {
  const keyInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { isAuth, setPrivateKey, clearAuth } = useAuthStore()

  const showMessage = (nextMessage: string) => {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(''), 3000)
  }

  const handleMainClick = () => {
    if (!isAuth) {
      keyInputRef.current?.click()
      return
    }
    setIsOpen((open) => !open)
  }

  const handleKeyChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await setPrivateKey(await file.text())
      showMessage('已解锁管理工作台，再次点击打开入口')
    } catch (error) {
      console.error(error)
      showMessage('密钥导入失败，请重试')
    } finally {
      event.currentTarget.value = ''
    }
  }

  const handleLock = () => {
    clearAuth()
    setIsOpen(false)
    showMessage('管理工作台已锁定')
  }

  return (
    <div className="fixed bottom-6 right-20 z-[60] flex flex-col items-end gap-3 md:right-24">
      {message && (
        <p className="max-w-64 rounded-xl border border-base-content/10 bg-base-100/95 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur">
          {message}
        </p>
      )}

      {isAuth && isOpen && (
        <div className="w-40 overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/95 p-2 shadow-2xl backdrop-blur">
          <p className="px-2 pb-2 pt-1 text-xs font-semibold text-success">管理工作台已解锁</p>
          <div className="space-y-1">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
          <div className="mt-1 border-t border-base-content/10 pt-1">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-base-content/65 transition-colors hover:bg-base-200"
              onClick={handleLock}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              锁定退出
            </button>
          </div>
        </div>
      )}

      <input
        ref={keyInputRef}
        type="file"
        accept=".pem"
        className="hidden"
        onChange={handleKeyChange}
      />
      <button
        type="button"
        className="btn btn-circle btn-primary h-12 w-12 border-0 shadow-lg shadow-primary/30 transition-transform hover:scale-110"
        aria-label={isAuth ? '打开管理工作台' : '导入管理员密钥'}
        aria-expanded={isAuth && isOpen}
        title={isAuth ? '管理工作台' : '导入管理员密钥'}
        onClick={handleMainClick}
      >
        {isAuth ? (
          isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Settings2 className="h-5 w-5" aria-hidden="true" />
        ) : (
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        )}
        {!isAuth && <KeyRound className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-base-100 p-0.5 text-primary" aria-hidden="true" />}
      </button>
    </div>
  )
}
