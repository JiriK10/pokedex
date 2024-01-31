"use client"

import { useEffect, useState } from "react"
import { ToastNotification } from "@carbon/react"
import { AnimatePresence, motion } from "framer-motion"

import { useDispatch, useSelector, toastsSlice, Toast } from "@/lib/redux"

interface AnimatedToastProps {
  toast: Toast
}

function AnimatedToast({ toast }: AnimatedToastProps) {
  const dispatch = useDispatch()
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setClosed(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (closed) {
      const timer = setTimeout(
        () => dispatch(toastsSlice.actions.remove(toast.id)),
        500
      )
      return () => clearTimeout(timer)
    }
  }, [closed])

  return (
    <AnimatePresence>
      {!closed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <ToastNotification
            data-test="toast"
            kind={toast.kind}
            statusIconDescription=" "
            timeout={0}
            onClose={() => {
              setClosed(true)
              return false
            }}
          >
            <div className="my-3">{toast.title}</div>
          </ToastNotification>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Toasts() {
  const toasts = useSelector(toastsSlice.selectors.toasts)
  return (
    <div className="fixed flex flex-col items-center bottom-4 left-1/2 -translate-x-1/2 space-y-2">
      {toasts.map((toast) => (
        <AnimatedToast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
