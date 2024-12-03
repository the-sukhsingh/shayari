"use client"
import React,{useState,useEffect} from 'react'
import Link from 'next/link'; 
const Home = () => {
  const [Poems, setPoems] = useState(null)

  const fetchData = async () => {
      try {
          const res = await fetch("/api/add",
          {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          }
          )
          const data = await res.json()
          setPoems(data)
      } catch (error) {
          console.error(error)
      }
  }
  useEffect(() => {
      fetchData()
  }, [])

  if(!Poems) return (
    <>
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-200"></div>
    </div>
    </>
  )
  return (
    <>
        <div className="">
      <div className="w-full p-3 md:w-4/5 m-auto md:grid md:grid-cols-2 md:gap-3">
        {Poems && (
          <>
            {Poems.map((poem) => (
              <Link href={`/${poem.slug}`} key={poem._id}>
                <div
                  className="
            title-block
              shadow-xl
              p-4
              text-2xl
              my-4
              transition-all
              cursor-pointer
            "
                >
                  <h2>{poem.title}</h2>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default Home;