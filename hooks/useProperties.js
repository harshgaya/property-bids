'use client'

import { useState, useEffect, useCallback } from 'react'

const DEFAULT = { type:'all', trust:[], budMin:'', budMax:'', sftMin:'', sftMax:'', facing:[], tags:[], city:'' }

export function useProperties(init = {}) {
  const [properties, setProperties] = useState([])
  const [loading,    setLoading]     = useState(false)
  const [error,      setError]       = useState(null)
  const [pagination, setPagination]  = useState({})
  const [filters,    setFilters]     = useState({ ...DEFAULT, ...init })
  const [page,       setPage]        = useState(1)

  const fetch_ = useCallback(async (f, p = 1) => {
    setLoading(true); setError(null)
    try {
      const q = new URLSearchParams()
      if (f.type && f.type !== 'all') q.set('type', f.type)
      if (f.trust?.length)  q.set('trust',  f.trust.join(','))
      if (f.budMin)         q.set('budMin', f.budMin)
      if (f.budMax)         q.set('budMax', f.budMax)
      if (f.sftMin)         q.set('sftMin', f.sftMin)
      if (f.sftMax)         q.set('sftMax', f.sftMax)
      if (f.facing?.length) q.set('facing', f.facing.join(','))
      if (f.tags?.length)   q.set('tags',   f.tags.join(','))
      if (f.city)           q.set('city',   f.city)
      q.set('page', p); q.set('limit', '18')

      const res  = await fetch(`/api/properties?${q}`)
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setProperties(data.data)
      setPagination(data.pagination)
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_(filters, page) }, [filters, page, fetch_])

  const update = useCallback((v) => { setFilters(p => ({ ...p, ...v })); setPage(1) }, [])
  const reset  = useCallback(() => { setFilters(DEFAULT); setPage(1) }, [])

  return { properties, loading, error, pagination, filters, page, setPage, update, reset }
}
