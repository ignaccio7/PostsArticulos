export default function GridArticlesSkeleton () {
  return (
    <>
    <div className="w-full max-w-[350px] md:mx-auto h-[50px] bg-white/20 rounded-lg animate-pulse my-4"></div>
    <div className="grid-articles grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 w-full h-full mb-4">
      <div className='w-full max-w-[600px] mx-auto h-[150px] md:h-[350px] bg-white/20 rounded-lg animate-pulse'></div>
      <div className='w-full max-w-[600px] mx-auto h-[150px] md:h-[350px] bg-white/20 rounded-lg animate-pulse'></div>
      <div className='w-full max-w-[600px] mx-auto h-[150px] md:h-[350px] bg-white/20 rounded-lg animate-pulse'></div>
      <div className='w-full max-w-[600px] mx-auto h-[150px] md:h-[350px] bg-white/20 rounded-lg animate-pulse'></div>
      <div className='w-full max-w-[600px] mx-auto h-[150px] md:h-[350px] bg-white/20 rounded-lg animate-pulse'></div>
      <div className='w-full max-w-[600px] mx-auto h-[150px] md:h-[350px] bg-white/20 rounded-lg animate-pulse'></div>
    </div>
    </>
  )
}
