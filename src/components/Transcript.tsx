'use client'

import {
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import Button from './Button'
import { CaretLeft, PlayerPause, PlayerPlay, PlayerStop, User } from './icons'
import { Role, Timestamp } from '@/types'

interface Props {
  audioSrc: string
  timestamps: Timestamp[]
}

const INDICATOR_TOP_INIT = 32

const Transcript = ({ audioSrc, timestamps }: Props) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [indicatorTop, setIndicatorTop] = useState(INDICATOR_TOP_INIT)

  const messagesRef = useRef<HTMLOListElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTimeText = useMemo(() => {
    const minutes = Math.floor(currentTime / 60)
      .toString()
      .padStart(2, '0')
    const seconds = Math.floor(currentTime % 60)
      .toString()
      .padStart(2, '0')

    return `${minutes} : ${seconds}`
  }, [currentTime])

  useEffect(() => {
    if (!audioRef.current || !messagesRef.current) return

    const duration = audioRef.current.duration

    if (currentTime === duration) {
      setIsPlaying(false)
      setCurrentTime(0)
      return
    }

    const currentMessage = timestamps.find(
      ({ start, end }) => start <= currentTime && currentTime <= end
    )

    if (currentMessage) {
      const currentMessageElement =
        messagesRef.current.querySelector<HTMLElement>(
          `[data-start="${currentMessage.start}"]`
        )

      if (!currentMessageElement) return

      setIndicatorTop(
        currentMessageElement.offsetTop +
          (currentMessageElement.clientHeight + 20) / 2
      )
    } else {
      const nextMessage = timestamps.find(({ start }) => currentTime < start)

      if (!nextMessage) {
        setIndicatorTop(
          messagesRef.current.offsetTop +
            messagesRef.current.clientHeight +
            16 / 2
        )
        return
      }

      const nextMessageElement = messagesRef.current.querySelector<HTMLElement>(
        `[data-start="${nextMessage.start}"]`
      )

      if (!nextMessageElement) return

      const silenceTop = nextMessageElement.offsetTop - 16 / 2
      setIndicatorTop(silenceTop)
    }
  }, [currentTime, timestamps])

  const handleAudioTimeUpdate = useCallback(() => {
    if (!audioRef.current) return

    setCurrentTime(audioRef.current.currentTime)
  }, [])

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (!audioRef.current) return

      const time = Number(e.target.value)
      audioRef.current.currentTime = time
      setCurrentTime(time)
    },
    []
  )

  const handleTogglePlay = useCallback(() => {
    if (!audioRef.current) return

    isPlaying ? audioRef.current.pause() : audioRef.current.play()
    setIsPlaying(prevValue => !prevValue)
  }, [isPlaying])

  const handleButtonStop = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
  }, [])

  const handleMessageClick = useCallback(
    (start: number) => () => {
      if (!audioRef.current) return

      audioRef.current.currentTime = start
      setCurrentTime(start)
    },
    []
  )

  return (
    <article className="transcript relative flex flex-col mx-6 text-sm w-[32rem] rounded-2xl text-indigo-400 bg-white shadow-2xl scale-110 translate-y-28 opacity-0 overflow-hidden">
      <div className="chat flex-grow relative p-8 overflow-auto">
        <ol ref={messagesRef} className="flex flex-col gap-4">
          {timestamps.map(({ role, content, start, end }) => (
            <li
              key={start}
              className={`flex flex-col gap-2 max-w-[87.5%] cursor-pointer hover:opacity-100 transition ease-out ${
                role === Role.USER ? 'self-end items-end' : ''
              } ${
                isPlaying &&
                (start <= currentTime && currentTime <= end
                  ? 'playing'
                  : 'opacity-75 scale-[98%]')
              }`}
              data-start={start}
              onClick={handleMessageClick(start)}
            >
              <div
                className={`flex items-center gap-1 ${
                  role === Role.USER ? ' text-indigo-400' : ' text-slate-500'
                }`}
              >
                <User />
                <small className={`text-[0.75rem] leading-none`}>
                  {role === Role.USER ? 'Usuario' : 'Agente'}
                </small>
              </div>
              <p
                className={`px-3 py-2 text-indigo-950 outline-1 rounded-md duration-200 ease-out ${
                  role === Role.USER ? 'bg-indigo-100' : 'bg-slate-100'
                } ${
                  isPlaying &&
                  (start <= currentTime && currentTime <= end ? 'outline' : '')
                } ${
                  role === Role.USER
                    ? 'outline-indigo-300'
                    : 'outline-slate-300'
                }`}
              >
                {content}
              </p>
            </li>
          ))}
        </ol>
        <span
          className="indicator absolute top-0 right-[0.375rem] -translate-y-[0.625rem] duration-300 ease-out"
          style={{ top: indicatorTop }}
        >
          <CaretLeft />
        </span>
      </div>

      <footer className="flex items-center gap-4 p-4 border-t border-indigo-100 shadow-2xl">
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleAudioTimeUpdate}
        />
        <div className="flex gap-2">
          <Button
            {...(isPlaying
              ? { title: 'Pausar', icon: <PlayerPause /> }
              : { title: 'Reproducir', icon: <PlayerPlay /> })}
            handleClick={handleTogglePlay}
          />
          <Button
            icon={<PlayerStop />}
            title="Detener"
            handleClick={handleButtonStop}
          />
        </div>
        <div className="flex-grow flex items-center gap-2">
          <input
            className="flex-grow h-1 rounded-full appearance-none bg-slate-300 outline-none"
            type="range"
            value={currentTime}
            min={0}
            max={audioRef.current?.duration}
            onChange={handleRangeChange}
          />
          <small className="current-time w-11 text-sm text-end">
            {currentTimeText}
          </small>
        </div>
      </footer>
    </article>
  )
}

export default Transcript
