'use client'
import GetCoinsData from '@/rgcomponents/GetCoinsData'
import Image from 'next/image'
import { Input } from '@/components/ui/input';

import { useEffect, useState } from 'react';
import { gtagEvent } from '@/lib/utils';

export default function Home() {

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [holdings, setHoldings] = useState(0);
  const [potentialValue, setPotentialValue] = useState(0);

  const handleHoldingsChange = (e) => {
    setHoldings(e.target.value);
    gtagEvent({
      action: 'click',
      params: { actionType: 'enteredHoldings', value: e.target.value }
    })
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
    <main className="flex min-h-screen flex-col items-center justify-center  text-center">

      <Image priority src="/shibnew.webp" className="w-full" width={1600} height={400} alt="Crypto Scenario Calculator, find out what your holdings value might be" />
      <div className="flex min-h-screen flex-col items-center justify-center  text-center p-4 lg:p-24">
        <h1 className="text-lg lg:text-3xl font-bold mt-20 lg:mt-4">Crypto Scenario Calculator, find out what your holdings value might be</h1>
        <div className="max-w-[800px] my-10 mx-8 flex flex-row items-center justify-center lg:justify-start gap-3 flex-wrap">
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
          <h2>How Crypto scenario calculator Works</h2>
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
          <h3 className="text-lg font-bold my-2">Visualize Your Potential Gains</h3>
          <p>This tool provides a simple yet powerful way to visualize the potential gains of your cryptocurrency investments under specific market conditions. Just enter your details and let our calculator unveil the possibilities!</p>
        </div>

        <section className="text-left">
          <Image src="/innerimage.webp" className="float-left mr-4 mb-2" width={400} height={400} alt="ValorisVisio: Unleash the Power of Your Crypto Holdings with Our Revolutionary Crypto Scenario Calculator" />
          <h2 className="text-xl font-bold my-2">ValorisVisio: Unleash the Power of Your Crypto Holdings with Our Revolutionary Crypto Scenario Calculator</h2>
          <h3 className="text-lg font-bold my-2">Introduction to the Thrilling World of ValorisVisio{`'`}s Crypto Scenario Calculator:</h3>
          <p>Ever imagined the exhilaration of watching your crypto holdings skyrocket? With ValorisVisio{`'`}s Crypto Scenario Calculator, that dream is closer than ever. This isn{`'`}t just a tool; it{`'`}s your gateway to visualizing potential wealth in the dynamic realm of cryptocurrency. Here, we invite you to not just track, but to actively explore the {`'`}what-ifs{`'`} of the crypto market.</p>
          <h3 className="text-lg font-bold my-2">Experience the Magic of {`'`}What If{`'`} with ValorisVisio:</h3>
          <p>Imagine this: You input your current crypto holdings and select a target project. In moments, the Crypto Scenario Calculator reveals what your holdings could be worth if your chosen project reaches its market cap potential. This electrifying feature doesn{`'`}t just show numbers; it paints a picture of possibilities, turning the mundane act of calculation into an adventure in financial forecasting.</p>
          <h3 className="text-lg font-bold my-2">How the Crypto Scenario Calculator Ignites Your Investment Passion:</h3>
          <p>The secret sauce of ValorisVisio{`'`}s Calculator is its ability to make complex calculations feel like a treasure hunt. It uses real-time data, market trends, and historical performances to give you a glimpse into the future of your investments. This isn{`'`}t about dry predictions; it{`'`}s about experiencing the thrill of seeing your potential gains come to life on your screen.</p>
          <h3 className="text-lg font-bold my-2">Beyond Calculation: Empowering Your Investment Strategy with ValorisVisio:</h3>
          <p>But it{`'`}s not all about the excitement. The Crypto Scenario Calculator is a powerful ally in your investment journey. It helps you understand market dynamics, assess risk, and plan with more confidence. By seeing potential outcomes, you{`'`}re equipped to make smarter, more informed decisions about your crypto portfolio.</p>
          <h3 className="text-lg font-bold my-2">Conclusion: Your Journey to Crypto Mastery Begins with ValorisVisio:</h3>
          <p>ValorisVisio is more than an app; it{`'`}s a revolution in how you view your crypto investments. It transforms the complex world of cryptocurrency into an exhilarating journey of discovery. Whether you{`'`}re a seasoned investor or just starting out, ValorisVisio{`'`}s Crypto Scenario Calculator is your ticket to experiencing the thrill of potential wealth in the crypto market. Embrace the excitement, and let your crypto dreams take flight with ValorisVisio.</p>
          <Image src="/shib.webp" className="float-right m-4" width={600} height={400} alt="ValorisVisio: Unleash the Power of Your Crypto Holdings with Our Revolutionary Crypto Scenario Calculator" />
          <h3 className="text-lg font-bold my-2">Crypto Scenarios Calculator: Unleash the Power of Strategic Crypto Investment</h3>
          <p>In the ever-evolving world of cryptocurrency, the need for a dynamic and intuitive tool like the <strong>Crypto Scenarios Calculator</strong> cannot be overstated. This tool is a game-changer for investors seeking to navigate the complexities of cryptocurrency markets with confidence and clarity.</p>
          <h3 className="text-lg font-bold my-2">Discover the Magic of the Crypto Scenarios Calculator</h3>
          <p>The <strong>Crypto Scenarios Calculator</strong> is not just a tool; it{`'`}s your gateway to mastering the art of crypto investment. It provides a thrilling visual and analytical journey through your crypto holdings, turning the usual stress of market analysis into an engaging and insightful experience. The <strong>Crypto Scenarios Calculator</strong> makes understanding your portfolio{`'`}s potential not just easy, but exciting.</p>
          <h3 className="text-lg font-bold my-2">How the Crypto Scenarios Calculator Transforms Your Investment Strategy</h3>
          <p>The <strong>Crypto Scenarios Calculator</strong> excels in breaking down complex market data into understandable and actionable insights. By harnessing the advanced algorithms of the <strong>Crypto Scenarios Calculator</strong>, investors can vividly see the potential growth of their crypto investments. This isn{`'`}t just number-crunching; it{`'`}s a strategic tool that empowers you to make informed decisions.</p>
          <h3 className="text-lg font-bold my-2">Experience the Excitement with Crypto Scenarios Calculator</h3>
          <p>Each interaction with the <strong>Crypto Scenarios Calculator</strong> is an adventure. It visualizes various investment scenarios, offering a glimpse into the potential future of your portfolio. The excitement of uncovering the possibilities within your crypto investments is what sets the <strong>Crypto Scenarios Calculator</strong> apart.</p>
          <Image src="/shibimg.webp" className="float-left m-4 ml-0" width={600} height={400} alt="ValorisVisio: Unleash the Power of Your Crypto Holdings with Our Revolutionary Crypto Scenario Calculator" />
          <h3 className="text-lg font-bold my-2">Crypto Scenarios Calculator: Unleash the Power of Strategic Crypto Investment</h3>
          <h3 className="text-lg font-bold my-2">Comprehensive Features of the Crypto Scenarios Calculator</h3>
          <p>The <strong>Crypto Scenarios Calculator</strong> goes beyond mere calculations. It{`'`}s a comprehensive suite equipped with features tailored for the modern crypto investor:</p>
          <ol>
            <li><strong>Dynamic Market Analysis</strong>: The <strong>Crypto Scenarios Calculator</strong> navigates through market trends to predict potential impacts on your investments.</li>
            <li><strong>In-depth Risk Assessment</strong>: With the <strong>Crypto Scenarios Calculator</strong>, balance risk and potential gains effortlessly.</li>
            <li><strong>Strategic Planning</strong>: The tool offers visualizations of various investment strategies, enhancing your decision-making process.</li>
            <li><strong>Real-Time Data Integration</strong>: The <strong>Crypto Scenarios Calculator</strong> stays updated with the latest market changes, keeping your strategy sharp and informed.</li>
          </ol>
          <h3 className="text-lg font-bold my-2">Empowerment through the Crypto Scenarios Calculator</h3>
          <p>The <strong>Crypto Scenarios Calculator</strong> is not just about managing investments; it{`'`}s about empowering investors with the knowledge and foresight to make smart, strategic decisions. The tool is designed to help you strike the perfect balance between caution and ambition in your crypto trading endeavors.</p>
          <h3 className="text-lg font-bold my-2">The Indispensable Crypto Scenarios Calculator</h3>
          <p>In a market where timing and information are everything, the <strong>Crypto Scenarios Calculator</strong> is your indispensable ally. It{`'`}s not just an analytical tool; it{`'`}s a comprehensive solution for the savvy crypto investor.</p>
          <h3 className="text-lg font-bold my-2">Embrace the Future with the Crypto Scenarios Calculator</h3>
          <p>The <strong>Crypto Scenarios Calculator</strong> represents a new era in cryptocurrency investment. It{`'`}s an essential tool for anyone looking to make informed, strategic, and successful crypto investments. Dive into the world of cryptocurrency with confidence and excitement, backed by the unparalleled capabilities of the <strong>Crypto Scenarios Calculator</strong>.</p>
          <Image src="/hero.webp" className="mt-10 w-full" width={1600} height={600} alt="Ever wonder what your bag value will be if your crypto holdings market cap matches another crypto project? Here you can visualize your potential gains in that possible scenario, just input your holdings and select your target crypto project, and visualize how mutch your current holdings value would be in that case." />

          {/* <h2 className="text-xl font-bold my-2">CRYPTO SCENARIO CALCULATOR INVESTMENT ANALYTICS APP</h2>
        <p className="p2">Cryptocurrency investments are volatile. Continuous market analysis is key to thrive in this niche. But that takes time and requires top level market analysis skills. As you invest, it&rsquo;s also critical to diversify your investments and spread risks. That way, you can achieve better outcomes.</p>
        <p className="p2">Investing in multiple cryptocurrencies may require even more time from you. As your assets grow in worth, it may become a challenge to manage them if you do not have a proper tool to achieve that. This makes it necessary to have a cryptocurrency portfolio tracker.</p>
        <p className="p3">Cryptocurrency Data Analytics</p>
        <p className="p2">A cryptocurrency investment analytics app is an important tool in analyzing crypto data. Investors and brokers need assorted data to make informed decisions with their investments. The cryptocurrency investment app does all the analysis and only provides you with the relevant information you need to invest right.</p>
        <p className="p2">Market analysis is critical before putting your money on crypto. But you must remember that other investors have similar information. Therefore, you need a more personalized analyst that works for you.</p>
        <p className="p2">Looking at <a href="https://coinmarketcap.com/" rel="nofollow"><span className="s1">https://coinmarketcap.com/</span></a>, there are 8800+ cryptocurrencies, 226 spot exchanges, 65 derivatives, 440 Decentralized exchanges among other platforms and investment opportunities. Each of them has wealth creation and management opportunities. But you need to do proper analysis on the product you&rsquo;re going to select.</p>
        <p className="p2">At the same time, competitors and other investors are applying different strategies to get a share of the same market you&rsquo;re trying to acquire. Without a proper cryptocurrency analytics tool, you&rsquo;re likely not to make the right investment calls.</p>
        <p className="p2">The analytics app breaks down price movements, circulation details, and liquidity information into plans you can act on to make the right investment decisions. That means that you save your time from repetitive tasks that you cannot work without.</p>
        <p className="p2">The goal of data analytics in this business is to get enough insights to make informed decisions. Therefore, you cannot miss out on the app because it does all the analysis for you and allows you to spend your precious time on other engagements.</p>
        <h3 className="text-lg font-bold my-2">Cryptocurrency Trading as an Investment</h3>
        <p className="p2">Trading cryptocurrency is one of the ways you can make money in cryptocurrency calculate your potential earnings with Crypto Scenarios Calculator. The blockchain backed technology allows you to sell your coins at a profit or HODL and sell after the prices rise. But this is not easy at all. That&rsquo;s why you need an analyst that will guide you rightfully.</p>
        <p className="p2">The trends analyzer has the ability to share insights that you will definitely need in your trades. For instance, you must perform risk assessment when investing a significant amount of money. A digital currency risk assessment tool will play an important role in helping you analyze what risk to take.</p>
        <p className="p2">Sometimes, the risk is so high but with a promise of higher returns. If you don&rsquo;t mind such investments, a risk assessment tool will help you find them. After deep assessment you&rsquo;ll have a report with all the information that you need to make decisions.</p>
        <h3 className="text-lg font-bold my-2">Crypto Scenario Calculator Planner</h3>
        <p className="p2">Market trends can be generic or influenced. As you start, you may have to deal with trends without the power to influence anything. But as you go on with trades online, you start to master the art of trading cryptocurrency. In your journey, you should leverage a <span className="Apple-converted-space">&nbsp; </span>cryptocurrency analytics app Crypto Scenarios Calculator. With such technology, you can create scenarios and try influence your market in your own capacity.</p>
        <p className="p2">Crypto Scenarios Calculator planners are meant to visualize what could happen in a market. The scenarios give you a chance to get ready to deal with difficult situations. By doing this, you allow yourself to become a better decision maker without being impulsive.</p>
        <p className="p2">Timing is critical in crypto trading. You may lose or gain millions within a minute. That&rsquo;s why every second matters. But the market doesn&rsquo;t need extremists in terms of greed or patience. You will lose assets if you&rsquo;re too greedy or patient. But the challenge is finding a balance between the two.</p>
        <p className="p2">With proper Crypto Scenarios Calculator planning, you already envision situations and when they happen, they find you ready. That readiness means you have control over greed which is a common source of losses for many cryptocurrency traders. On the other side, being too patient can be damaging as well.</p>
        <p className="p2">A well-done Crypto Scenario Calculator planning ensures you have a balanced emotion when investing. This is true especially if you&rsquo;re a novice in any form of trade.</p>
        <h3 className="text-lg font-bold my-2">Blockchain Analytics Software</h3>
        <p className="p2">Cryptocurrency is built on blockchain. This technology like many others is on continuous improvement by their solidity developers. That means algorithms change often. At one time, strategies that work for you now may be rendered useless with new developments. That&rsquo;s why you must not only keep an eye on cryptocurrency but on the wholesome blockchain technology as a whole.</p>
        <p className="p2">Blockchain analytics software allows you to have a clue about what&rsquo;s happening now and what the future holds. That way, you can align your strategies and adjust accordingly to protect and manage your wealth.</p>
        <p className="p2">The issue of compatibility and compliance is an important one. Some cryptocurrencies have a short life and may lead you to losses if you don&rsquo;t deal well with them. Therefore, it&rsquo;s critical to work with a blockchain analytics tool to establish the trends of the market and what the future holds.</p>
        <p className="p2">With such critical information it&rsquo;s possible to ensure that your net value continues appreciating and stands the test of time. That way, your portfolio will continue to grow and you won&rsquo;t have to deal with panic buys and sells. The moment you get to this point, where you hard trading skills and soft skills informing your trade decisions balance, is the moment you start to become an experience crypto trader. The result is massive gains. This gives you the power to grow immensely without limits.</p>
        <h3 className="text-lg font-bold my-2">Crypto Asset Comparison</h3>
        <p className="p2">As you ace your crypto trades, you build experience and skill. Within time, you&rsquo;d have built a portfolio with several crypto coins to your name. With time, some currencies tend to grow faster and become more stable than others. In fact, some coins lose their value to zero depending on a number of facts.</p>
        <p className="p2">This change in dynamics explains why you need to keep an asset comparison tracker. This allows you to compare cryptocurrencies with a goal to keep only those promising and get rid of those that will likely lead you to losses in the long run.</p>
        <p className="p2">There are different approaches traders apply when it comes to asset comparison. For instance, I can choose to concentrate my money on very stable and popular coins like Bitcoin and Ethereum. Or alternatively go for less popular coins and spread my risk in multiple of them. Sometimes, you can mix both approaches.</p>
        <p className="p2">Knowing which one to go with depends with a number of factors including market analysis. This must be done prudently and with an eye for detail. Once your mind is made up, you can spend your money on projects that you find worth investing in.</p>
        <p className="p2">After your investment, you must keep comparing your assets to envision your Crypto Scenario Calculator. Those that keep improving must be held on to. You must also cut your losses and get rid of assets that continuously depreciate without showing any signs of appreciating in the future.</p>
        <p className="p2">Sometimes, the less popular coins that have been well developed have the highest chances of growth. At the same time, they pose the highest risk. Those must be looked into and a proper analysis done to ensure that you put your money in the right project.</p>
        <h3 className="text-lg font-bold my-2">Cryptocurrency Investment Strategy</h3>
        <p className="p2">There are 5 common investment strategies you can employ in cryptocurrency. These are the most recommended strategies especially for beginners.</p>
        <ol className="ol1">
          <li className="li2">Dollar-Cost Averaging</li>
        </ol>
        <p className="p2">Greed and too much patience can be detrimental to your investments. For that reason, you need to make calculated steps to be able to achieve this. For instance, instead of investing a lump sum amount of $240 once, you can spread the risk and invest $20 only a month for a year. This strategy is referred to the dollar-cost averaging and allows the investor to assess the market and the cryptocurrency performance before proceeding with investments.</p>
        <p className="p2">This strategy saves the investor from investing a lot of money on a coin that lacks enough muscle to stand the test of time. In the event that occurs, you would have cut your losses early enough. In case the value continues to rise, you will continue to make money without having to worry about your greed or patience levels.</p>
        <p className="p2">One rule of this type of strategy is consistency. You must invest a similar amount consistently for some period of time. Worry not when the market dips. That&rsquo;s the best time to invest. Because when normalcy is restored, you&rsquo;ll definitely bounce back.</p>
        <ol className="ol1">
          <li className="li2">Crypto Scalping</li>
        </ol>
        <p className="p2">This strategy requires speed and quick decision making skills from the investor. The strategy involves entry and exit into markets in reaction to price changes. That means starting to trade when the prices are as low as possible and exiting the trade when the prices have gone up.</p>
        <p className="p2">In this approach, the focus is on the short term gains contrary to dollar cost averaging which is inclined towards long term investments. To flourish in this, you need to analyze historical price movements and volume levels then make a decision. Automating the analysis process with a Crypto Scenarios Calculator app will save you time and deliver the best results for you.</p>
        <ol className="ol1">
          <li className="li2">Day Trading</li>
        </ol>
        <p className="p2">Day traders buy and sell cryptocurrencies on the same day. This kind of trading is done on daily basis and the trader purchases the cryptocurrency at a lower rate to sell it at a higher price. Experts opine that this is one of the best investment strategies as it cushions you from the volatility that comes with cryptocurrency.</p>
        <p className="p2">Just like a retailer, the goal of day trading is to make money from the movement of goods. In this case, your cryptocurrencies are your goods. Sale of these goods guarantee you profits if well traded.</p>
        <ol className="ol1">
          <li className="li2">HODLing</li>
        </ol>
        <p className="p2">Like any other financial market, time earns value for money. HODLing is a great way to earn interest on your investment. HODLing involves acquiring digital assets and keeping them in your wallet. Most beginners find this the best option because all you need to do is buy your assets and keep them in your wallet for an extended time.</p>
        <p className="p2">As time goes by, the assets will appreciate in value and allow you to sell them at a gain. If you HODL long enough, you&rsquo;re likely going to make massive gains. As your investments grow you may need to spread the investments and acquire multiple digital assets.</p>
        <ol className="ol1">
          <li className="li2">Arbitrage Trading</li>
        </ol>
        <p className="p2">There are several online platforms offering markets for buyers and sellers to exchange their digital assets. It&rsquo;s important to note that each of these platforms has their own market forces dictating their prices. That means that a particular asset will cost cheaper or expensive with the variance coming from different platforms.</p>
        <p className="p2">In arbitrage trading, an investor purchases a digital asset from one platform and sells them on a different platform. This requires you to know the prices of a specific cryptocurrency on different platforms. The Crypto Scenarios Calculator app allows you to establish this and get the latest price movements.</p>
        <h3 className="text-lg font-bold my-2">Crypto Market Cap Analysis</h3>
        <p className="p2"><span className="s1"><a href="https://coinmarketcap.com/" rel="nofollow">https://coinmarketcap.com/</a></span> is the most reliable source of crypto data. By utilizing the data on this website, you put yourself a step ahead of other investors. Well-developed and designed crypto analytics app will give you all the data you need for analysis.</p>
        <p className="p2">Some of these apps come with crypto investment simulator for horning your skills. If well utilized, you can accumulate enough wealth for your portfolio.</p>
        <p className="p2">As you keep trading based on market cap analysis, you will be forced to perform digital asset portfolio optimization. This move ensures that you make the most of your portfolio. But this should only come after you&rsquo;ve had enough mix of crypto assets in your portfolio.</p>
        <p className="p2">The Crypto Scenarios Calculator tool should come with a crypto calculator that allows you to calculate asset values and make critical decisions. Digital wealth management will require you to make close trade offs all the time. This must get you ready and that&rsquo;s why you must download the crypto analytics app as soon as possible.</p>
        <p className="p5"></p> */}

        </section>
      </div>
    </main>
  )
}
