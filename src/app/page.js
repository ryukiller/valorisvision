import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <Image src="logo.svg" className="my-5" width={300} height={200} alt="Ever wonder what your bag value will be if your crypto holdings market cap matches another crypto project? Here you can visualize your potential gains in that possible scenario, just input your holdings and select your target crypto project, and visualize how mutch your current holdings value would be in that case." />
      <h1 className="text-3xl font-bold my-2">ValorisVisio Crypto Scenarios, what if...</h1>
      <h2 className="text-2xl font-bold my-2">Ever wonder what your bag value will be if your crypto holdings market cap matches another crypto project?</h2>
      <p className="my-2">Here you can visualize your potential gains in that possible scenario, just input your holdings and select your target crypto project, and visualize how mutch your current holdings value would be in that case.</p>
    </main>
  )
}
