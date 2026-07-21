'use client'

import { useWriteStore } from './stores/write-store'
import { usePreviewStore } from './stores/preview-store'
import { WriteEditor } from './components/editor'
import { WriteSidebar } from './components/sidebar'
import { WriteActions } from './components/actions'
import { WritePreview } from './components/preview'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { ArrowLeft, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useLoadBlog } from './hooks/use-load-blog'
import { useAuthStore } from './hooks/use-auth'

type WritePageProps = {
    categories?: string[]
}

export default function WritePage({ categories = [] }: WritePageProps) {
    const { isAuth } = useAuthStore()

    return (
        <>
            <Toaster
                richColors
                position="top-center"
                offset={120}
                toastOptions={{
                    className: 'shadow-xl rounded-2xl border-2 border-primary/20 backdrop-blur-sm',
                    style: {
                        fontSize: '1rem',
                        padding: '14px 20px',
                        zIndex: '999999',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease-in-out',
                    },
                    classNames: {
                        title: 'text-lg font-semibold tracking-tight',
                        description: 'text-sm font-medium opacity-90',
                        error: 'bg-error/95 text-error-content border-error/30',
                        success: 'bg-success/95 text-success-content border-success/30',
                        warning: 'bg-warning/95 text-warning-content border-warning/30',
                        info: 'bg-info/95 text-info-content border-info/30',
                    },
                    duration: 5000,
                    closeButton: false,
                }}
            />
            {isAuth ? <WriterWorkspace categories={categories} /> : <WriterAccessGate />}
        </>
    )
}

function WriterAccessGate() {
    const keyInputRef = useRef<HTMLInputElement>(null)
    const { setPrivateKey } = useAuthStore()

    const handlePrivateKey = async (file?: File) => {
        if (!file) return

        try {
            await setPrivateKey(await file.text())
            toast.success('作者工作台已解锁')
        } catch (error) {
            console.error(error)
            toast.error('密钥导入失败，请检查文件后重试')
        }
    }

    return (
        <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-28">
            <section className="w-full rounded-3xl border border-base-content/10 bg-base-100/80 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <LockKeyhole className="h-8 w-8" aria-hidden="true" />
                </div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-xs font-semibold text-base-content/60">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    作者专用区域
                </p>
                <h1 className="text-3xl font-bold tracking-tight">作者工作台已锁定</h1>
                <p className="mx-auto mt-4 max-w-md leading-7 text-base-content/65">
                    写作、编辑和发布仅供站点管理员使用。导入管理员密钥后，才会解锁本次会话的工作台。
                </p>

                <input
                    ref={keyInputRef}
                    type="file"
                    accept=".pem"
                    className="hidden"
                    onChange={async (event) => {
                        await handlePrivateKey(event.target.files?.[0])
                        event.currentTarget.value = ''
                    }}
                />
                <button
                    type="button"
                    className="btn btn-primary mt-8 gap-2 rounded-xl px-6 shadow-lg shadow-primary/20"
                    onClick={() => keyInputRef.current?.click()}
                >
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                    导入管理员密钥
                </button>
                <a href="/" className="btn btn-ghost mt-3 gap-2 rounded-xl">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    返回首页
                </a>
                <p className="mt-6 text-xs leading-5 text-base-content/45">
                    密钥仅用于获取 GitHub 发布授权；离开或锁定工作台后会清除本次会话授权。
                </p>
            </section>
        </main>
    )
}

function WriterWorkspace({ categories }: WritePageProps) {
    const { form, cover, reset } = useWriteStore()
    const { isPreview, closePreview } = usePreviewStore()
    const [slug, setSlug] = useState<string | null>(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const s = params.get('slug')
        if (s) {
            setSlug(s)
        } else {
            reset()
        }
    }, [])

    const { loading } = useLoadBlog(slug || undefined)

    const coverPreviewUrl = cover ? (cover.type === 'url' ? cover.url : cover.previewUrl) : null

    return (
        <>
            {isPreview ? (
                <WritePreview form={form} coverPreviewUrl={coverPreviewUrl} onClose={closePreview} slug={slug || undefined} />
            ) : (
                <>
                    <div className='flex flex-col md:flex-row h-full justify-center gap-6 px-4 md:px-6 pt-24 pb-12'>
                        <WriteEditor />
                        <WriteSidebar categories={categories} />
                    </div>

                    <WriteActions />
                </>
            )}
        </>
    )
}
