export default function PageHeader({ badge, title, subtitle, dark = false }) {
  return (
    <section className={`pt-28 pb-16 ${dark ? 'hero-gradient' : 'bg-white border-b border-gray-100'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 ${dark ? 'bg-white/10 text-green-300 border border-white/20' : 'bg-green-50 text-green-700 border border-green-100'}`}>
            {badge}
          </span>
        )}
        <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
        {subtitle && <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>}
      </div>
    </section>
  )
}
