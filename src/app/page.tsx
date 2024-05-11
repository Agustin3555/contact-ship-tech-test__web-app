import { Transcript } from '@/components'
import data from './data.json'

const Home = () => {
  return (
    <main className="flex items-center justify-center h-screen overflow-hidden">
      <Transcript audioSrc="/test-call.wav" timestamps={data} />
    </main>
  )
}

export default Home
