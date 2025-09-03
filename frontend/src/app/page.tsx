import React from 'react'

export default function Page() {
  return (
    <main>
      <div className="h-screen flex flex-1/2 flex-wrap">
        <div className='w-1/2 h-1/2 bg-blue-800 flex justify-center items-center'>
          <div className='h-20 w-20 bg-black rounded-2xl'></div>
        </div>
        <div className='w-1/2 h-1/2 bg-blue-300 flex justify-center items-center'>
          title of site
        </div>
        <div className='w-screen h-1/2 bg-blue-500 flex justify-center items-center'>slogan</div>
      </div>


      <div className="h-screen bg-amber-500">
        <div className="h-3/5 w-screen bg-amber-900 flex justify-center items-center">
          <div className='h-50 w-50 bg-black rounded-2xl'></div>
        </div>
        <div className="h-1/5 w-screen bg-amber-300 flex justify-center items-center">categories</div>
        <div className="h-1/5 w-screen bg-amber-900 flex"></div>
      </div>


      <div className="h-screen">
        <div className="h-3/5 w-screen bg-red-300 flex justify-center items-center">cursure</div>
        <div className="h-1/5 w-screen bg-red-900 flex justify-center items-center">inifinite scroll</div>
      </div>


      <div className="h-screen flex flex-wrap">
        <div className="h-1/3 w-screen bg-pink-300 flex">
          <div className="w-2/3">
            <h3 className='text-3xl'>title</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, in!
            </p>
          </div>
          <div className="w-1/3 bg-pink-950 flex justify-center items-center">
            <div className='h-20 w-20 bg-black rounded-2xl'></div>
          </div>
        </div>
        <div className="h-1/3 w-screen bg-pink-600 flex">
          <div className="w-1/3 bg-pink-950 flex justify-center items-center">
            <div className='h-20 w-20 bg-black rounded-2xl'></div>
          </div>
          <div className="w-2/3">
            <h3 className='text-3xl'>title</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, in!
            </p>
          </div>
        </div>
        <div className="h-1/3 w-screen bg-pink-900 flex">
          <div className="w-2/3">
            <h3 className='text-3xl'>title</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, in!
            </p>
          </div>
          <div className="w-1/3 bg-pink-950 flex justify-center items-center">
            <div className='h-20 w-20 bg-black rounded-2xl'></div>
          </div>
        </div>
      </div>


      <footer className='bg-white h-10 w-screen text-black flex justify-center items-center'>
        footer
      </footer>
    </main >
  )
}
