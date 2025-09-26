'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useModalController() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const current = searchParams.get('modal')

  const openModal = useCallback((name: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('modal', name)
    const qs = params.toString()
    router.push(`${window.location.pathname}${qs ? `?${qs}` : ''}`)
  }, [router, searchParams])

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.delete('modal')
    const qs = params.toString()
    router.push(`${window.location.pathname}${qs ? `?${qs}` : ''}`)
  }, [router, searchParams])

  return { current, openModal, closeModal }
}
