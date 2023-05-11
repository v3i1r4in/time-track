import NoSSR from '@/components/NoSSR';
import Calendar from '@/components/calendar/Calendar'
import Timer from '@/components/timer/Timer';
import Head from 'next/head'
import { use, useState } from 'react'

const BTN = ({ children, setter, setVal, val }) => <div style={{
  padding: '5px',
  flex: 1,
  textAlign: 'center',
  background: val === setVal ? '#bbb' : '#fff',
}} onClick={() => setter(setVal)}>
  {children}
</div>


export default function Home() {
  const [currentPage, setCurrentPage] = useState('timer');
  return (
    <>
      <Head>
        <link rel="icon" href="/calendar.ico" />
        <title>Calendar | Timetrack</title>
      </Head>
      <div
        style={{
          height: 'calc(100vh - 20px)',
          width: 'calc(100vw - 20px)',
          padding: '10px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{
          marginBottom: '10px', width: '100%'
        }}>
          <NoSSR>
            <Timer minView/>
          </NoSSR>
        </div>
        <div style={{
          flex: 1,
        }}>
          <NoSSR>
            <Calendar />
          </NoSSR>
        </div>
      </div>
    </>
  )
}
