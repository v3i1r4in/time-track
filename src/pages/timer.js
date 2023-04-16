import NoSSR from '@/components/NoSSR'
import Calendar from '@/components/calendar/Calendar'
import Timer from '@/components/timer/Timer'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" href="/chronometer.ico" />
        <title>Timer | Timetrack</title>
      </Head>
      <NoSSR>
        <Timer></Timer>
      </NoSSR>
    </>
  )
}
