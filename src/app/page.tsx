import { Transcript } from '@/components'
import { Timestamp } from '@/types'
import data from './data.json'

const Home = () => {
  return (
    <main className="flex items-center justify-center h-screen overflow-hidden">
      <Transcript audioSrc="/test-call.wav" timestamps={data as Timestamp[]} />
    </main>
  )
}

export default Home
