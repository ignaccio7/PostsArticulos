export default function SkeletonProfileForm () {
  return (
    <section className="container sm:w-4/5">
      <h1>Profile</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className='form__credentials w-full'>
          <label className="sm:!w-full h-12 !p-0 !m-0">
            <div className="w-full h-full bg-slate-700 rounded-full animate-pulse"></div>
          </label>
          <label className="sm:!w-full h-12 !p-0 !m-0">
            <div className="w-full h-full bg-slate-700 rounded-full animate-pulse"></div>
          </label>
          <label className="sm:!w-full h-12 !p-0 !m-0">
            <div className="w-full h-full bg-slate-700 rounded-full animate-pulse"></div>
          </label>
          <label className="sm:!w-full h-12 !p-0 !m-0">
            <div className="w-full h-full bg-slate-700 rounded-full animate-pulse"></div>
          </label>
        </div>
        <div className='form__credentials w-full self-start'>
          <label className="sm:!w-full h-12 !p-0 !m-0">
            <div className="w-full h-full bg-slate-700 rounded-full animate-pulse"></div>
          </label>
        </div>
      </div>
    </section>
  )
}
