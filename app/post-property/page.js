'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RiHome4Line, RiMapPin2Line, RiCameraLine, RiMoneyDollarCircleLine, RiCheckLine, RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri'
import { PROPERTY_TYPES, FACING, TAGS, PLANS } from '@/constants'

const STEPS = [
  { id: 1, label: 'Property Type',  icon: RiHome4Line },
  { id: 2, label: 'Details',        icon: RiMapPin2Line },
  { id: 3, label: 'Photos',         icon: RiCameraLine },
  { id: 4, label: 'Pricing',        icon: RiMoneyDollarCircleLine },
]

export default function PostPropertyPage() {
  const [step,    setStep]    = useState(1)
  const [form,    setForm]    = useState({ type:'', title:'', price:'', facing:'', tags:[], plan:'basic', address:{ area:'', city:'', state:'', pincode:'' }, fields:{} })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const router = useRouter()

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))
  const setAddr = (k, v) => setForm(p => ({ ...p, address: { ...p.address, [k]: v } }))
  const setFields = (k, v) => setForm(p => ({ ...p, fields: { ...p.fields, [k]: v } }))
  const toggleTag = (t) => set('tags', form.tags.includes(t) ? form.tags.filter(x=>x!==t) : [...form.tags, t])

  async function submit() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/properties', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, price: parseFloat(form.price) * 100000, priceLabel: `₹${form.price} L`, trust: 'basic', isActive: true }) })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      router.push(`/property/${data.data._id}?posted=true`)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done    = step > s.id
            const current = step === s.id
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${done ? 'bg-green-600 text-white' : current ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-gray-200 text-gray-500'}`}>
                    {done ? <RiCheckLine /> : <Icon />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${current ? 'text-green-600' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded ${step > s.id ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            )
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">

          {/* Step 1 — Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">What are you selling?</h2>
              <p className="text-gray-400 text-sm mb-6">Select the type of property you want to list.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROPERTY_TYPES.filter(t => t.value !== 'all').map(({ value, label, icon }) => (
                  <button key={value} onClick={() => set('type', value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${form.type === value ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-green-300'}`}>
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Property Details</h2>
              <p className="text-gray-400 text-sm mb-5">Tell buyers about your property.</p>

              <div>
                <label className="label-style">Title</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. 3 BHK Villa with Garden in Jubilee Hills"
                  className="input-style" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-style">Area / Locality</label>
                  <input value={form.address.area} onChange={e => setAddr('area', e.target.value)} placeholder="Jubilee Hills"
                    className="input-style" />
                </div>
                <div>
                  <label className="label-style">City</label>
                  <input value={form.address.city} onChange={e => setAddr('city', e.target.value)} placeholder="Hyderabad"
                    className="input-style" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['villa','apartment','highrise','house'].includes(form.type) && (
                  <div>
                    <label className="label-style">BHK</label>
                    <select value={form.fields.bhk || ''} onChange={e => setFields('bhk', parseInt(e.target.value))} className="input-style">
                      <option value="">Select</option>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} BHK</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="label-style">Facing</label>
                  <select value={form.facing} onChange={e => set('facing', e.target.value)} className="input-style">
                    <option value="">Select</option>
                    {FACING.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {['villa','apartment','highrise','house'].includes(form.type) && (
                <div>
                  <label className="label-style">Built-up Area (Sq ft)</label>
                  <input type="number" value={form.fields.sft || ''} onChange={e => setFields('sft', parseInt(e.target.value))} placeholder="1500"
                    className="input-style" />
                </div>
              )}

              <div>
                <label className="label-style">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {TAGS.map(t => (
                    <button key={t} onClick={() => toggleTag(t)} type="button"
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${form.tags.includes(t) ? 'bg-green-50 text-green-700 border-green-400' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Photos */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Add Photos</h2>
              <p className="text-gray-400 text-sm mb-6">Minimum 5 live camera photos required for trust verification.</p>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-green-400 transition-colors cursor-pointer">
                <RiCameraLine className="text-gray-300 text-5xl mx-auto mb-3" />
                <p className="font-semibold text-gray-600 mb-1">Upload Photos</p>
                <p className="text-sm text-gray-400 mb-4">5+ live camera shots required · Max 30 photos</p>
                <button className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors">
                  Select Photos
                </button>
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-semibold text-amber-700">📸 GPS Stamp Required</p>
                <p className="text-xs text-amber-600 mt-1">Each photo will be stamped with GPS coordinates and timestamp to prevent fake listings.</p>
              </div>
            </div>
          )}

          {/* Step 4 — Pricing & Plan */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Set Price & Listing Plan</h2>
              <p className="text-gray-400 text-sm mb-5">Set your asking price and choose verification level.</p>

              <div>
                <label className="label-style">Asking Price (₹ Lakhs)</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="85"
                  className="input-style text-xl font-bold" />
                {form.price && <p className="text-sm text-gray-400 mt-1">= ₹{(parseFloat(form.price) * 100000).toLocaleString('en-IN')}</p>}
              </div>

              <div>
                <label className="label-style mb-3 block">Verification Plan</label>
                <div className="space-y-3">
                  {PLANS.map(plan => (
                    <button key={plan.key} onClick={() => set('plan', plan.key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${form.plan === plan.key ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                      <span className={`w-4 h-4 rounded-full flex-shrink-0 ${plan.dotClass}`} />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
                        <p className="text-xs text-gray-500">{plan.features[0]}</p>
                      </div>
                      <span className="font-black text-gray-900">{plan.priceLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-0 transition-all">
            <RiArrowLeftLine /> Back
          </button>

          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !form.type}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all">
              Continue <RiArrowRightLine />
            </button>
          ) : (
            <button onClick={submit} disabled={loading || !form.price}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all">
              {loading ? 'Submitting...' : <><RiCheckLine /> Post Property</>}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .label-style { display:block; font-size:0.75rem; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.375rem; }
        .input-style { display:block; width:100%; padding:0.75rem 1rem; font-size:0.875rem; border:1px solid #e5e7eb; border-radius:0.75rem; outline:none; transition:all 0.15s; background:white; }
        .input-style:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }
      `}</style>
    </div>
  )
}
