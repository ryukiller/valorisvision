'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GetCoinsData from '@/rgcomponents/GetCoinsData'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { gtagEvent } from '@/lib/utils'
import { TrendingUp, Calculator, Coins, ArrowRight, Target, PiggyBank } from 'lucide-react'
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
      // Clear stale result when inputs are incomplete (intentional)
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const fieldCard = "border-line bg-panel/70 backdrop-blur-sm hover:border-neon-cyan/40 transition-colors duration-300"
  const fieldLabel = "font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Main Calculator Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative cyber-frame border border-line bg-panel/50 backdrop-blur-md p-6 md:p-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <p className="term-label mb-4 flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-neon-cyan/60" />
            {'// what_if.exe'}
            <span className="w-10 h-px bg-neon-cyan/60" />
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glitch font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground"
            data-text="SCENARIO CALCULATOR"
          >
            SCENARIO <span className="text-neon-cyan">CALCULATOR</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
          >
            Calculate what your holdings would be worth if your cryptocurrency
            reaches another coin&apos;s market cap.
          </motion.p>
        </div>

        {/* Calculator Form */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Holdings Input */}
            <Card className={fieldCard}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <PiggyBank className="w-4 h-4 text-neon-acid" />
                  <label className={fieldLabel}>Your Holdings</label>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter amount of tokens/coins"
                    value={holdings}
                    onChange={handleHoldingsChange}
                    className="h-14 text-lg bg-void/60 border-line focus:border-neon-cyan focus:ring-neon-cyan/30 font-mono"
                  />
                  <Coins className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* From Coin Selection */}
            <Card className={fieldCard}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-4 h-4 text-neon-cyan" />
                  <label className={fieldLabel}>Your Current Cryptocurrency</label>
                </div>
                <GetCoinsData onCoinSelect={handleFrom} fieldName="from" />
                {from && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 border border-line bg-void/40 cyber-cut-sm"
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
                        <p className="font-semibold text-foreground">{from.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">${from.current_price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* To Coin Selection */}
            <Card className={fieldCard}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-4 h-4 text-neon-magenta" />
                  <label className={fieldLabel}>Target Market Cap</label>
                </div>
                <GetCoinsData onCoinSelect={handleTo} fieldName="to" />
                {to && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 border border-line bg-void/40 cyber-cut-sm"
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
                        <p className="font-semibold text-foreground">{to.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">Mkt Cap: ${to.market_cap?.toLocaleString()}</p>
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
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Calculation Result */}
            <Card className="border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/[0.06] to-void/40 min-h-[220px] flex items-center justify-center cyber-frame">
              <CardContent className="p-6 w-full">
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="calculating"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 mx-auto mb-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin shadow-neon-cyan" />
                      <p className="font-mono text-sm tracking-[0.2em] uppercase text-neon-cyan animate-pulse">
                        Crunching data…
                      </p>
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
                      <p className="term-label">{'// potential_value'}</p>

                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="font-mono text-4xl md:text-5xl font-bold text-neon-acid drop-shadow-[0_0_16px_rgba(200,255,46,0.4)]"
                      >
                        ${potentialValue.toLocaleString()}
                      </motion.div>

                      {currentHoldingsValue > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-2 pt-2"
                        >
                          <div className="flex items-center justify-between text-sm border-b border-line/60 pb-2">
                            <span className={fieldLabel}>Current Value</span>
                            <span className="font-mono">${currentHoldingsValue.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={fieldLabel}>Potential Gain</span>
                            <Badge
                              variant={percentageGain >= 0 ? "default" : "destructive"}
                              className={percentageGain >= 0 ? "bg-neon-acid text-void hover:bg-neon-acid font-mono" : ""}
                            >
                              {percentageGain >= 0 ? '+' : ''}{percentageGain.toFixed(2)}%
                            </Badge>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-muted-foreground"
                    >
                      <Calculator className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="font-mono text-sm tracking-wider">Awaiting input to render simulation…</p>
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
                className="flex-1 h-12 cyber-cut bg-neon-cyan text-void font-mono text-xs uppercase tracking-[0.25em] hover:brightness-110 hover:shadow-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-none"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              <Button
                onClick={resetCalculator}
                variant="outline"
                className="h-12 px-6 cyber-cut border-line text-foreground font-mono text-xs uppercase tracking-[0.25em] hover:border-neon-magenta/60 hover:text-neon-magenta transition-all rounded-none"
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
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 flex items-center gap-3">
              {'// run_history'}
              <Badge variant="secondary" className="font-mono">{calculationHistory.length}</Badge>
            </h3>
            <div className="grid gap-3 max-h-60 overflow-y-auto pr-1">
              {calculationHistory.map((calc, index) => (
                <motion.div
                  key={calc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-line bg-void/40 cyber-cut-sm hover:border-neon-cyan/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-mono">
                      <span className="text-foreground">{calc.holdings}</span>
                      <span className="text-muted-foreground">{calc.from}</span>
                      <ArrowRight className="w-4 h-4 text-neon-cyan" />
                      <span className="text-muted-foreground">{calc.to}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-neon-acid">${calc.potentialValue.toLocaleString()}</div>
                      <div className={`text-xs font-mono ${calc.percentageGain >= 0 ? 'text-neon-cyan/70' : 'text-neon-magenta'}`}>
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
