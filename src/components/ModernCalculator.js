'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GetCoinsData from '@/rgcomponents/GetCoinsData'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { gtagEvent } from '@/lib/utils'
import { TrendingUp, Calculator, Coins, DollarSign, ArrowRight, Sparkles, Target, PiggyBank } from 'lucide-react'
import Image from 'next/image'

export default function ModernCalculator() {
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [holdings, setHoldings] = useState('')
  const [potentialValue, setPotentialValue] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [calculationHistory, setCalculationHistory] = useState([])
  const resultRef = useRef(null)

  const handleHoldingsChange = (e) => {
    const value = e.target.value
    setHoldings(value)
    if (value) {
      gtagEvent({
        action: 'input_change',
        params: { actionType: 'enteredHoldings', value: value }
      })
    }
  }

  const calculatePotentialValue = async () => {
    if (from && to && holdings > 0) {
      setIsCalculating(true)

      // Simulate calculation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800))

      const potentialPrice = to.market_cap / from.circulating_supply
      const potentialHoldingsValue = potentialPrice * parseFloat(holdings)
      const currentHoldingsValue = from.current_price * parseFloat(holdings)
      const percentageGain = ((potentialHoldingsValue - currentHoldingsValue) / currentHoldingsValue) * 100

      setPotentialValue(potentialHoldingsValue)
      setShowResult(true)
      setIsCalculating(false)

      // Add to calculation history
      const calculation = {
        id: Date.now(),
        from: from.name,
        to: to.name,
        holdings: parseFloat(holdings),
        currentValue: currentHoldingsValue,
        potentialValue: potentialHoldingsValue,
        percentageGain: percentageGain,
        timestamp: new Date()
      }

      setCalculationHistory(prev => [calculation, ...prev.slice(0, 4)]) // Keep last 5 calculations

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)

      gtagEvent({
        action: 'calculation_completed',
        params: {
          from_coin: from.name,
          to_coin: to.name,
          holdings: holdings,
          result_value: potentialHoldingsValue
        }
      })
    }
  }

  const handleFrom = (coin) => {
    setFrom(coin)
    setShowResult(false)
  }

  const handleTo = (coin) => {
    setTo(coin)
    setShowResult(false)
  }

  useEffect(() => {
    if (from && to && holdings > 0) {
      const debounceTimer = setTimeout(() => {
        calculatePotentialValue()
      }, 1000)
      return () => clearTimeout(debounceTimer)
    } else {
      setShowResult(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, holdings])

  const resetCalculator = () => {
    setFrom(null)
    setTo(null)
    setHoldings('')
    setPotentialValue(0)
    setShowResult(false)
  }

  const currentHoldingsValue = from && holdings ? from.current_price * parseFloat(holdings) : 0
  const percentageGain = currentHoldingsValue > 0 ? ((potentialValue - currentHoldingsValue) / currentHoldingsValue) * 100 : 0

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-green-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Calculator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
          >
            Crypto Scenario Calculator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Discover your crypto potential. Calculate what your holdings could be worth if your cryptocurrency reaches another coin&apos;s market cap.
          </motion.p>
        </div>

        {/* Calculator Form */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Holdings Input */}
            <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <PiggyBank className="w-5 h-5 text-green-500" />
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Your Holdings
                  </label>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter amount of tokens/coins"
                    value={holdings}
                    onChange={handleHoldingsChange}
                    className="pl-4 pr-12 h-14 text-lg backdrop-blur-sm bg-white/50 dark:bg-black/30 border-white/30 focus:border-blue-400 transition-all duration-300"
                  />
                  <Coins className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* From Coin Selection */}
            <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-blue-500" />
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Your Current Cryptocurrency
                  </label>
                </div>
                <GetCoinsData onCoinSelect={handleFrom} fieldName="from" />
                {from && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-white/20 dark:bg-black/20"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={from.image !== 'missing_large.png' ? from.image : '/logoicon.svg'}
                        width={32}
                        height={32}
                        alt={from.name}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{from.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">${from.current_price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* To Coin Selection */}
            <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Target Market Cap
                  </label>
                </div>
                <GetCoinsData onCoinSelect={handleTo} fieldName="to" />
                {to && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-white/20 dark:bg-black/20"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={to.image !== 'missing_large.png' ? to.image : '/logoicon.svg'}
                        width={32}
                        height={32}
                        alt={to.name}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{to.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap: ${to.market_cap?.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Calculation Result */}
            <Card className="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/30 min-h-[200px] flex items-center justify-center">
              <CardContent className="p-6 w-full">
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="calculating"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Calculating...</p>
                    </motion.div>
                  ) : showResult && potentialValue > 0 ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      ref={resultRef}
                      className="text-center space-y-4"
                    >
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <DollarSign className="w-8 h-8 text-green-500" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Potential Value</h3>
                      </div>

                      <div className="space-y-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
                        >
                          ${potentialValue.toLocaleString()}
                        </motion.div>

                        {currentHoldingsValue > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Current Value:</span>
                              <span className="font-semibold">${currentHoldingsValue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Potential Gain:</span>
                              <Badge
                                variant={percentageGain >= 0 ? "default" : "destructive"}
                                className={percentageGain >= 0 ? "bg-green-500 hover:bg-green-600" : ""}
                              >
                                {percentageGain >= 0 ? '+' : ''}{percentageGain.toFixed(2)}%
                              </Badge>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-gray-500 dark:text-gray-400"
                    >
                      <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Enter your details to see the calculation</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button
                onClick={calculatePotentialValue}
                disabled={!from || !to || !holdings || isCalculating}
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate
              </Button>
              <Button
                onClick={resetCalculator}
                variant="outline"
                className="h-12 px-6 backdrop-blur-sm bg-white/20 dark:bg-black/20 border-white/30 hover:bg-white/30 dark:hover:bg-black/30 rounded-xl transition-all duration-300"
              >
                Reset
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Calculation History */}
        {calculationHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span>Recent Calculations</span>
              <Badge variant="secondary">{calculationHistory.length}</Badge>
            </h3>
            <div className="grid gap-3 max-h-60 overflow-y-auto">
              {calculationHistory.map((calc, index) => (
                <motion.div
                  key={calc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/20 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{calc.holdings}</span>
                      <span className="text-gray-500">{calc.from}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{calc.to}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${calc.potentialValue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {calc.percentageGain >= 0 ? '+' : ''}{calc.percentageGain.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}