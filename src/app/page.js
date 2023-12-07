'use client'
import GetCoinsData from '@/rgcomponents/GetCoinsData'
import Image from 'next/image'
import { Input } from '@/components/ui/input';

import { useEffect, useState } from 'react';

export default function Home() {

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [holdings, setHoldings] = useState(0);
  const [potentialValue, setPotentialValue] = useState(0);

  const handleHoldingsChange = (e) => {
    setHoldings(e.target.value);
  };

  const calculatePotentialValue = () => {
    if (from && to && holdings > 0) {
      const potentialPrice = to.market_cap / from.circulating_supply;
      const potentialHoldingsValue = potentialPrice * holdings;
      setPotentialValue(potentialHoldingsValue);
    }
  };

  const handleFrom = (coin) => {
    setFrom(coin);
    // Any other logic you need when a coin is selected
  };
  const handleTo = (coin) => {
    setTo(coin);
    // Any other logic you need when a coin is selected
  };

  useEffect(() => {
    calculatePotentialValue();
  }, [from, to, holdings])


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-24 text-center">
      <h1 className="text-lg lg:text-3xl font-bold mt-20 lg:mt-4">Crypto Scenario, find out what your holdings value might be</h1>
      <div className="max-w-[800px] my-20 mx-8 flex flex-row items-center justify-center lg:justify-start gap-3 flex-wrap">
        <span>This are my holdings $</span>
        <Input className="w-auto" type="number" name="bag" placeHolder="Tokens/Coins amount" onChange={handleHoldingsChange} />
        <span>what if my coin/token</span>
        <GetCoinsData onCoinSelect={handleFrom} fieldName="from" />
        <span>reaches this other {`coin's`}/token market cap</span>
        <GetCoinsData onCoinSelect={handleTo} fieldName="to" />
        {potentialValue > 0 && (
          <span>Your holdings could potentially be worth: <span className="font-bold text-lg text-emerald-600">${potentialValue.toLocaleString()}</span></span>
        )}
      </div>
      <div className="text-left max-w-[1000px] my-20 mx-6">
        <h2>How It Works</h2>
        <ol className="list-decimal flex flex-col gap-4">
          <li>
            <p><strong>Enter Your Holdings</strong>: Start by inputting the number of coins you currently hold in the cryptocurrency of your choice.</p>
          </li>
          <li>
            <p><strong>Select Your Current Cryptocurrency ({`"From"`})</strong>: Choose the cryptocurrency you currently own. This is the coin whose future potential you want to explore.</p>
          </li>
          <li>
            <p><strong>Choose Your Target Cryptocurrency ({`"To"`})</strong>: Select another cryptocurrency whose market cap represents your target or goal. This is the market cap your current cryptocurrency would need to reach.</p>
          </li>
          <li>
            <p><strong>Discover Potential Value</strong>: Our tool calculates what your holdings could be worth if your current {`cryptocurrency's`} market cap matches that of your target. It does this by estimating a new potential price for your current coin, derived from the {`target's`} market cap divided by your current {`coin's`} circulating supply. Then, it multiplies this potential price by your current holdings to estimate their future value.</p>
          </li>
        </ol>
        <h3>Visualize Your Potential Gains</h3>
        <p>This tool provides a simple yet powerful way to visualize the potential gains of your cryptocurrency investments under specific market conditions. Just enter your details and let our calculator unveil the possibilities!</p>
      </div>

      <Image src="logo.svg" className="my-5 dark:brightness-[10]" width={300} height={200} alt="Ever wonder what your bag value will be if your crypto holdings market cap matches another crypto project? Here you can visualize your potential gains in that possible scenario, just input your holdings and select your target crypto project, and visualize how mutch your current holdings value would be in that case." />
      <h2 className="text-xl font-bold my-2">ValorisVisio Crypto Scenarios, what if...</h2>
      <h3 className="text-lg font-bold my-2">Ever wonder what your bag value will be if your crypto holdings market cap matches another crypto project?</h3>
      <p className="my-2 text-justify">Here you can visualize your potential gains in that possible scenario, just input your holdings and select your target crypto project, and visualize how mutch your current holdings value would be in that case.</p>
    </main>
  )
}
