import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: { message: 'Text and target language are required' } },
        { status: 400 }
      )
    }

    // Mock translation service - in production, use Google Translate API or similar
    const mockTranslations: Record<string, Record<string, string>> = {
      es: {
        'Analysis of': 'Análisis de',
        'This document contains': 'Este documento contiene',
        'words': 'palabras',
        'characters': 'caracteres',
        'Legal terminology detected': 'Terminología legal detectada',
        'Risk-related clauses identified': 'Cláusulas relacionadas con riesgos identificadas',
        'Standard document structure': 'Estructura de documento estándar',
        'Low risk indicators found': 'Indicadores de bajo riesgo encontrados',
        'Financial terms and conditions present': 'Términos y condiciones financieras presentes',
        'No significant financial clauses': 'No hay cláusulas financieras significativas',
        'Comprehensive document structure': 'Estructura de documento integral',
        'Concise document format': 'Formato de documento conciso'
      },
      fr: {
        'Analysis of': 'Analyse de',
        'This document contains': 'Ce document contient',
        'words': 'mots',
        'characters': 'caractères',
        'Legal terminology detected': 'Terminologie juridique détectée',
        'Risk-related clauses identified': 'Clauses liées aux risques identifiées',
        'Standard document structure': 'Structure de document standard',
        'Low risk indicators found': 'Indicateurs de faible risque trouvés',
        'Financial terms and conditions present': 'Termes et conditions financières présents',
        'No significant financial clauses': 'Aucune clause financière significative',
        'Comprehensive document structure': 'Structure de document complète',
        'Concise document format': 'Format de document concis'
      },
      de: {
        'Analysis of': 'Analyse von',
        'This document contains': 'Dieses Dokument enthält',
        'words': 'Wörter',
        'characters': 'Zeichen',
        'Legal terminology detected': 'Rechtsterminologie erkannt',
        'Risk-related clauses identified': 'Risikobezogene Klauseln identifiziert',
        'Standard document structure': 'Standard-Dokumentstruktur',
        'Low risk indicators found': 'Niedrige Risikoindikatoren gefunden',
        'Financial terms and conditions present': 'Finanzielle Bedingungen vorhanden',
        'No significant financial clauses': 'Keine wesentlichen Finanzklauseln',
        'Comprehensive document structure': 'Umfassende Dokumentstruktur',
        'Concise document format': 'Prägnantes Dokumentformat'
      },
      it: {
        'Analysis of': 'Analisi di',
        'This document contains': 'Questo documento contiene',
        'words': 'parole',
        'characters': 'caratteri',
        'Legal terminology detected': 'Terminologia legale rilevata',
        'Risk-related clauses identified': 'Clausole relative ai rischi identificate',
        'Standard document structure': 'Struttura del documento standard',
        'Low risk indicators found': 'Indicatori di basso rischio trovati'
      },
      pt: {
        'Analysis of': 'Análise de',
        'This document contains': 'Este documento contém',
        'words': 'palavras',
        'characters': 'caracteres',
        'Legal terminology detected': 'Terminologia legal detectada',
        'Risk-related clauses identified': 'Cláusulas relacionadas a riscos identificadas',
        'Standard document structure': 'Estrutura de documento padrão',
        'Low risk indicators found': 'Indicadores de baixo risco encontrados'
      }
    }

    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    let translatedText = text
    const langTranslations = mockTranslations[targetLanguage]
    
    if (langTranslations) {
      // Apply translations for known phrases
      Object.entries(langTranslations).forEach(([english, translated]) => {
        translatedText = translatedText.replace(new RegExp(english, 'gi'), translated)
      })
    } else {
      // For unsupported languages, add a prefix
      const languageNames: Record<string, string> = {
        ru: 'Russian',
        ja: 'Japanese',
        ko: 'Korean',
        zh: 'Chinese',
        ar: 'Arabic',
        hi: 'Hindi'
      }
      const langName = languageNames[targetLanguage] || 'Unknown'
      translatedText = `[${langName} Translation] ${text}`
    }

    return NextResponse.json({
      translatedText,
      sourceLanguage,
      targetLanguage,
      confidence: langTranslations ? 0.95 : 0.7
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: { message: 'Translation Service Unavailable' } },
      { status: 503 }
    )
  }
}
