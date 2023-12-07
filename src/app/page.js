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
      <h2>
        Navigating the Crypto Investment Landscape with ValorisVisio: Your Ultimate Guide to Market Mastery
      </h2>


      <h3>Introduction toValorisVisio Crypto Scenarios:</h3>

      <p>
        In the fast-paced world of cryptocurrency, staying ahead of market trends and making informed investment decisions is crucial. ValorisVisio emerges as a beacon for crypto enthusiasts, offering a comprehensive solution that transcends traditional crypto investment apps. This article delves into how ValorisVisio stands out as a cryptocurrency market analysis tool, providing users with an unparalleled experience in crypto scenario planning, portfolio tracking, and market forecasting.
      </p>
      <h3>Understanding Crypto Investment App Essentials:</h3>

      <p>
        The landscape of digital currency investment has evolved rapidly, necessitating tools that offer more than just basic tracking functionalities. A high-quality crypto investment app like ValorisVisio provides a holistic view of your portfolio, integrating features such as cryptocurrency trends analyzer and crypto market predictions. We'll explore how these features empower investors to make strategic decisions.
      </p>
      <h3>ValorisVisio: Your Cryptocurrency Market Analysis Expert:</h3>

      <p>
        Diving deeper into market analysis, ValorisVisio serves as your crypto analytics tool, offering insights into the volatile world of digital currencies. It's not just about tracking; it's about understanding the why and how behind market movements. We'll discuss how the app's advanced analytics turn complex data into actionable insights.
      </p>
      <h3>The Art of Crypto Scenario Planning with ValorisVisio:</h3>

      <p>
        One of the standout features of ValorisVisio is its crypto scenario planner. This tool allows investors to simulate various market conditions, understanding potential outcomes and preparing for future market shifts. This section will explain how scenario planning can be a game-changer in your investment strategy.
      </p>
      <h3>Maximizing Portfolio Performance with Advanced Analytics:</h3>

      <p>
        ValorisVisio goes beyond basic portfolio tracking. It offers a comprehensive suite of tools for crypto portfolio analysis, helping users optimize their investments. We'll explore how the app aids in cryptocurrency risk management and portfolio diversification, ensuring that your investments are aligned with your financial goals.
      </p>
      <h3>Conclusion:</h3>

      <p>
        In conclusion, ValorisVisio redefines the way investors interact with the crypto market. From crypto market cap analysis to digital asset management, the app offers everything needed to navigate the complex world of cryptocurrency investing confidently. Whether you're a seasoned trader or new to the crypto space, ValorisVisio is designed to elevate your investment journey.
      </p>
    </main>
  )
}
