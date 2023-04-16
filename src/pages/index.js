import Calendar from '@/components/calendar/Calendar'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" href="/calendar.ico" />
        <title>Calendar | Timetrack</title>
      </Head>
      <Calendar></Calendar>
    </>
  )
}
