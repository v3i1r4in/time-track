import Calendar from '@/components/calendar/Calendar'
import Timer from '@/components/timer/Timer'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Timer | Timetrack</title>
      </Head>
      <Timer></Timer>
    </>
  )
}
