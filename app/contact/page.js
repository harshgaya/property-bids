'use client'

import { useState } from 'react'
import PageHeader    from '@/components/common/PageHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { RiMapPin2Line, RiPhoneLine, RiMailLine, RiWhatsappLine, RiSendPlaneLine } from 'react-icons/ri'
import { SITE } from '@/constants'

export default function ContactPage() {
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', message:'' })
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  const contactItems = [
    { icon: RiMapPin2Line,  label:'Address',   value:`${SITE.address.line1}, ${SITE.address.line2}, ${SITE.address.city}, ${SITE.address.state} — ${SITE.address.pin}` },
    { icon: RiPhoneLine,    label:'Phone',      value: SITE.phone,       href:`tel:${SITE.phone}` },
    { icon: RiMailLine,     label:'Email',      value: SITE.email,       href:`mailto:${SITE.email}` },
    { icon: RiWhatsappLine, label:'WhatsApp',   value:'Message us',      href:`https://wa.me/${SITE.whatsapp}` },
  ]

  return (
    <>
      <PageHeader badge="Get In Touch" title="Contact Us" subtitle="Have a question? We're here to help. Usually respond within 2 hours." />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">

            {/* Contact info */}
            <AnimatedSection animation="anim-fade-left">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Reach Us Directly</h2>
              <div className="space-y-5 mb-10">
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-green-600 text-base" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-gray-700 hover:text-green-600 transition-colors font-medium">{value}</a>
                      ) : (
                        <p className="text-sm text-gray-700">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
                <p className="font-semibold text-gray-900 mb-1">Support Hours</p>
                <p className="text-sm text-gray-500">Monday – Saturday: 9 AM – 7 PM IST</p>
                <p className="text-sm text-gray-500 mt-1">Sunday: 10 AM – 4 PM IST</p>
              </div>
            </AnimatedSection>

            {/* Contact form */}
            <AnimatedSection animation="anim-fade-right">
              {sent ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RiSendPlaneLine className="text-green-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm">We'll get back to you within 2 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
                  <h3 className="font-extrabold text-gray-900 text-lg mb-5">Send a Message</h3>
                  {[
                    { key:'name',    label:'Your Name',    type:'text',  placeholder:'Suresh Reddy' },
                    { key:'email',   label:'Email Address',type:'email', placeholder:'you@example.com' },
                    { key:'phone',   label:'Mobile Number',type:'tel',   placeholder:'+91 98765 43210' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                      <input type={f.type} required placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Message</label>
                    <textarea required rows={4} placeholder="How can we help you?" value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-60 transition-all">
                    {loading ? 'Sending...' : <><RiSendPlaneLine /> Send Message</>}
                  </button>
                </form>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
