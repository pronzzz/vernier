import type { ComponentChildren } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { CloseIcon } from './icons'

/** A native <dialog>: focus trap and Escape for free, with an animated close. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ComponentChildren }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.classList.remove('is-closing')
      d.showModal()
    } else if (!open && d.open) {
      d.classList.add('is-closing')
      const done = () => {
        d.close()
        d.classList.remove('is-closing')
      }
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) done()
      else d.addEventListener('animationend', done, { once: true })
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      class="sheet"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div class="sheet-inner">
        <div class="sheet-head">
          <h2>{title}</h2>
          <button type="button" class="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
