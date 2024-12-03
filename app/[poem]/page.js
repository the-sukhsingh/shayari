"use client"
import React,{useState,useEffect} from 'react'
import ScaleButtons from '../components/ScaleButtons'
import { useParams } from 'next/navigation'

const Page = () => {
    const { poem }= useParams()
    const [poems, setPoems] = useState(null)

    useEffect(() => {
      if (poems) {
          document.title = poems.title;
      }
  }, [poems])

    useEffect(() => {
        fetch(`/api/${poem}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => setPoems(data))
        .catch(err => console.error(err))
    }, [poem])

    if(!poems) return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-200"></div>
        </div>
      )

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
    <h1 className="text-4xl font-bold mb-4 underline text-center">{poems.title}</h1>
<div className="max-w-4xl leading-relaxed text-center poem-text">
        <p className='poem-text-p' dangerouslySetInnerHTML={{ __html: poems.body.replace(/\n/g, "<br>")}}></p>
</div>
<ScaleButtons />
</div>
  )
}


export default Page
