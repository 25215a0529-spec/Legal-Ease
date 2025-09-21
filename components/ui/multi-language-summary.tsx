'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Download, 
  Globe, 
  Copy, 
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface MultiLanguageSummaryProps {
  summary: string
  title?: string
  className?: string
}

interface Translation {
  language: string
  code: string
  text: string
  flag: string
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
]

export function MultiLanguageSummary({ 
  summary, 
  title = "Document Summary",
  className = '' 
}: MultiLanguageSummaryProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [translations, setTranslations] = useState<Record<string, Translation>>({
    en: { language: 'English', code: 'en', text: summary, flag: '🇺🇸' }
  })
  const [isTranslating, setIsTranslating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Mock translation function (in real implementation, use Google Translate API or similar)
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    setIsTranslating(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock translations for demonstration
    const mockTranslations: Record<string, Record<string, string>> = {
      es: {
        'Analysis of': 'Análisis de',
        'This document contains': 'Este documento contiene',
        'words': 'palabras',
        'Legal terminology detected': 'Terminología legal detectada',
        'Risk-related clauses identified': 'Cláusulas relacionadas con riesgos identificadas',
        'Standard document structure': 'Estructura de documento estándar',
        'Low risk indicators found': 'Indicadores de bajo riesgo encontrados'
      },
      fr: {
        'Analysis of': 'Analyse de',
        'This document contains': 'Ce document contient',
        'words': 'mots',
        'Legal terminology detected': 'Terminologie juridique détectée',
        'Risk-related clauses identified': 'Clauses liées aux risques identifiées',
        'Standard document structure': 'Structure de document standard',
        'Low risk indicators found': 'Indicateurs de faible risque trouvés'
      },
      de: {
        'Analysis of': 'Analyse von',
        'This document contains': 'Dieses Dokument enthält',
        'words': 'Wörter',
        'Legal terminology detected': 'Rechtsterminologie erkannt',
        'Risk-related clauses identified': 'Risikobezogene Klauseln identifiziert',
        'Standard document structure': 'Standard-Dokumentstruktur',
        'Low risk indicators found': 'Niedrige Risikoindikatoren gefunden'
      }
    }

    let translatedText = text
    const langTranslations = mockTranslations[targetLang]
    
    if (langTranslations) {
      Object.entries(langTranslations).forEach(([english, translated]) => {
        translatedText = translatedText.replace(new RegExp(english, 'gi'), translated)
      })
    } else {
      // For other languages, add a prefix to indicate translation
      translatedText = `[${SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name} Translation] ${text}`
    }
    
    setIsTranslating(false)
    return translatedText
  }

  // Handle language change
  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode)
    
    if (!translations[langCode]) {
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === langCode)
      if (langInfo) {
        const translatedText = await translateText(summary, langCode)
        setTranslations(prev => ({
          ...prev,
          [langCode]: {
            language: langInfo.name,
            code: langCode,
            text: translatedText,
            flag: langInfo.flag
          }
        }))
      }
    }
  }

  // Text-to-speech functionality
  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.pause()
        setIsPlaying(false)
      } else {
        const currentText = translations[selectedLanguage]?.text || summary
        const utterance = new SpeechSynthesisUtterance(currentText)
        
        // Set language for better pronunciation
        utterance.lang = selectedLanguage === 'en' ? 'en-US' : 
                        selectedLanguage === 'es' ? 'es-ES' :
                        selectedLanguage === 'fr' ? 'fr-FR' :
                        selectedLanguage === 'de' ? 'de-DE' :
                        selectedLanguage === 'it' ? 'it-IT' :
                        selectedLanguage === 'pt' ? 'pt-PT' :
                        selectedLanguage === 'ru' ? 'ru-RU' :
                        selectedLanguage === 'ja' ? 'ja-JP' :
                        selectedLanguage === 'ko' ? 'ko-KR' :
                        selectedLanguage === 'zh' ? 'zh-CN' :
                        selectedLanguage === 'ar' ? 'ar-SA' :
                        selectedLanguage === 'hi' ? 'hi-IN' : 'en-US'
        
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = isMuted ? 0 : 1
        
        utterance.onstart = () => setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        
        speechSynthesisRef.current = utterance
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    const currentText = translations[selectedLanguage]?.text || summary
    try {
      await navigator.clipboard.writeText(currentText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  // Download as text file
  const handleDownload = () => {
    const currentText = translations[selectedLanguage]?.text || summary
    const langName = translations[selectedLanguage]?.language || 'English'
    const blob = new Blob([currentText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `summary-${langName.toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const currentTranslation = translations[selectedLanguage]
  const currentText = currentTranslation?.text || summary

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {title}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            {currentTranslation?.flag || '🇺🇸'}
            {currentTranslation?.language || 'English'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isTranslating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Translating...
            </div>
          )}
        </div>

        {/* Summary Text */}
        <motion.div
          key={selectedLanguage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-muted/30 rounded-lg p-4 min-h-[120px]"
        >
          <p className="text-sm leading-relaxed text-foreground">
            {currentText}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayAudio}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
