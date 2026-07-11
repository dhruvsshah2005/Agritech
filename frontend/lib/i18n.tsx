'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the translation types supporting 16 languages (15+ languages)
export type LanguageCode = 
  | 'hi' | 'en' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'pa' | 'ml'
  | 'or' | 'as' | 'ur' | 'sa' | 'es' | 'ne';

interface Translations {
  [key: string]: {
    [code in LanguageCode]: string;
  };
}

// Translations dictionary for the 16 languages
export const translations: Translations = {
  // Navigation Labels
  home: {
    en: 'Home',
    hi: 'मुख्य पृष्ठ',
    bn: 'মূল পাতা',
    te: 'హోమ్',
    mr: 'मुख्य पान',
    ta: 'முகப்பு',
    gu: 'હોમ',
    kn: 'ಮುಖಪುಟ',
    pa: 'ਮੁੱਖ ପੰਨਾ',
    ml: 'ഹോം',
    or: 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    as: 'মূল পৃষ্ঠা',
    ur: 'ہوم',
    sa: 'मुख्यपृष्ठम्',
    es: 'Inicio',
    ne: 'गृह पृष्ठ'
  },
  voice: {
    en: 'Voice',
    hi: 'आवाज़',
    bn: 'কণ্ঠস্বর',
    te: 'వాయిస్',
    mr: 'आवाज',
    ta: 'குரல்',
    gu: 'અવાજ',
    kn: 'ಧ್ವನಿ',
    pa: 'ਆਵਾਜ਼',
    ml: 'ശബ്ദം',
    or: 'ସ୍ୱର',
    as: 'কণ্ঠস্বৰ',
    ur: 'آواز',
    sa: 'वाक्',
    es: 'Voz',
    ne: 'आवाज'
  },
  weather: {
    en: 'Weather',
    hi: 'मौसम',
    bn: 'আবহাওয়া',
    te: 'వాతావరణం',
    mr: 'हवामान',
    ta: 'வானிலை',
    gu: 'હવામાન',
    kn: 'ಹವಾಮಾನ',
    pa: 'ਮੌਸਮ',
    ml: 'കാലാവസ്ഥ',
    or: 'ପାଣିପାଗ',
    as: 'বতৰ',
    ur: 'موسم',
    sa: 'ऋतुः',
    es: 'Clima',
    ne: 'मौसम'
  },
  crops: {
    en: 'Crops',
    hi: 'फसलें',
    bn: 'ফসল',
    te: 'పంటలు',
    mr: 'पिके',
    ta: 'பயிர்கள்',
    gu: 'પાક',
    kn: 'ಬೆಳೆಗಳು',
    pa: 'ਫਸਲਾਂ',
    ml: 'ವಿളകൾ',
    or: 'ଫସଲ',
    as: 'শস্য',
    ur: 'فصلیں',
    sa: 'सस्यानि',
    es: 'Cultivos',
    ne: 'बाली'
  },
  alerts: {
    en: 'Alerts',
    hi: 'चेतावनियाँ',
    bn: 'সতর্কता',
    te: 'హెచ్చరికలు',
    mr: 'सेटिंग्ज',
    ta: 'எச்சரிக்கைகள்',
    gu: 'ચેતવણીઓ',
    kn: 'ಎಚ್ಚರಿಕೆಗಳು',
    pa: 'ਚੇਤਾਵਨੀਆਂ',
    ml: 'അറിയിപ്പുകൾ',
    or: 'ସତର୍କତା',
    as: 'সতৰ্কতা',
    ur: 'انتباہات',
    sa: 'सूचनाः',
    es: 'Alertas',
    ne: 'सचेत'
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    bn: 'সেটিংস',
    te: 'సెట్టింగులు',
    mr: 'सेटिंग्ज',
    ta: 'அமைப்புகள்',
    gu: 'સેટિંગ્સ',
    kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    pa: 'ਸੈਟਿੰਗਾਂ',
    ml: 'സെറ്റിംഗ്സ്',
    or: 'ସେଟିଙ୍ଗ୍ସ',
    as: 'ছেটিংছ',
    ur: 'سیٹنگز',
    sa: 'सज्जीकरणम्',
    es: 'Ajustes',
    ne: 'सेटिङहरू'
  },
  logout: {
    en: 'Log out',
    hi: 'लॉग आउट',
    bn: 'লগ আউট',
    te: 'లాଗ ഔട്ട്',
    mr: 'लॉग आउट',
    ta: 'வெளியேறு',
    gu: 'લોગ આઉટ',
    kn: 'ಲಾಗ್ ಔಟ್',
    pa: 'ਲੌਗ ਆਉਟ',
    ml: 'ലോഗ് ഔട്ട്',
    or: 'ଲଗ୍ ଆଉଟ୍',
    as: 'লগ আউট',
    ur: 'لاگ آؤٹ',
    sa: 'निर्गमनम्',
    es: 'Cerrar sesión',
    ne: 'लॉग आउट'
  },
  
  // Settings Screen
  settingsTitle: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    bn: 'সেটিংস',
    te: 'సెట్టింగులు',
    mr: 'सेटिंग्ज',
    ta: 'அமைப்புகள்',
    gu: 'સેટિંગ્સ',
    kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    pa: 'ਸੈਟਿੰਗਾਂ',
    ml: 'സെറ്റിംഗ്സ്',
    or: 'ସେଟିଙ୍ଗ୍ସ',
    as: 'ছেটিংছ',
    ur: 'سیٹنگز',
    sa: 'सज्जीकरणम्',
    es: 'Ajustes',
    ne: 'सेटिङहरू'
  },
  settingsSubtitle: {
    en: 'Manage your profile and preferences',
    hi: 'अपनी प्रोफ़ाइल और प्राथमिकताएं प्रबंधित करें',
    bn: 'আপনার প্রোফাইল এবং পছন্দগুলি পরিচালনা করুন',
    te: 'మీ ప్రొఫైల్ మరియు ప్రాధाన్యతలను నిర్వహించండి',
    mr: 'तुमचे प्रोफाइल आणि प्राधान्ये व्यवस्थापित करा',
    ta: 'உங்கள் சுயவிவரம் மற்றும் விருப்பங்களை நிர்வகிக்கவும்',
    gu: 'તમારી પ્રોફાઇલ અને પસંદગીઓ મેનેજ કરો',
    kn: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    pa: 'ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਤਰਜੀਹਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',
    ml: 'നിങ്ങളുടെ പ്രൊഫൈലും മുൻഗണനകളും നിയന്ത്രിക്കുക',
    or: 'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଏବଂ ପସନ୍ଦ ପରିଚାଳନା କରନ୍ତୁ',
    as: 'আপোনাৰ প্ৰফাইল আৰু পছন্দসমূহ পৰিচালনা কৰক',
    ur: 'اپنے پروفائل اور ترجیحات کا انتظام کریں',
    sa: 'स्वकीयं विवरणं सज्जीकुरुत',
    es: 'Administra tu perfil y preferencias',
    ne: 'आफ्नो प्रोफाइल र प्राथमिकताहरू व्यवस्थापन गर्नुहोस्'
  },
  saveProfile: {
    en: 'Save Profile',
    hi: 'प्रोफ़ाइल सहेजें',
    bn: 'প্রোফাইল সংরক্ষণ করুন',
    te: 'ప్రొఫైల్ సేవ్ చేయి',
    mr: 'प्रोफाइल जतन करा',
    ta: 'சுயவிவரத்தை சேமி',
    gu: 'પ્રોફાઇલ સાચવો',
    kn: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
    pa: 'ਪ੍ਰੋਫਾਈਲ ਸੰਭਾਲੋ',
    ml: 'പ്രൊഫൈൽ സംരക്ഷിക്കുക',
    or: 'ପ୍ରୋଫାଇଲ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ',
    as: 'প্ৰফাইল সংৰক্ষণ কৰক',
    ur: 'پروفائل محفوظ کریں',
    sa: 'विवरणं रक्षत',
    es: 'Guardar perfil',
    ne: 'प्रोفाइल बचत गर्नुहोस्'
  },
  updateLanguage: {
    en: 'Update Language Preference',
    hi: 'भाषा प्राथमिकता अपडेट करें',
    bn: 'ভাষা পছন্দ আপডেট করুন',
    te: 'భాషా ప్రాధాన్యతను నవీకరించు',
    mr: 'भाषा प्राधान्य अपडेट करा',
    ta: 'மொழி விருப்பத்தை புதுப்பி',
    gu: 'ભાષા પસંદગી અપડેટ કરો',
    kn: 'ಭಾಷಾ ಆದ್ಯತೆಯನ್ನು ನವೀಕರಿಸಿ',
    pa: 'ਭਾਸ਼ਾ ਤਰਜੀਹ ਅਪਡੇਟ ਕਰੋ',
    ml: 'ഭാഷാ മുൻഗണന പുതുക്കുക',
    or: 'ଭାଷା ପସନ୍ଦ ଅପଡେଟ୍ କରନ୍ତୁ',
    as: 'ভাষা পছন্দ উন্নীত কৰক',
    ur: 'زبان کی ترجیح اپ ڈیٹ کریں',
    sa: 'भाषां परिवर्तयत',
    es: 'Actualizar idioma',
    ne: 'भाषा प्राथमिकता अपडेट गर्नुहोस्'
  },
  appLanguage: {
    en: 'App Language',
    hi: 'ऐप की भाषा',
    bn: '앱의 भाषा',
    te: 'యాప్ భాష',
    mr: 'अ‍ॅपची भाषा',
    ta: 'செயலி மொழி',
    gu: 'એપ ભાષા',
    kn: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ',
    pa: 'ਐਪ ਦੀ ਭਾਸ਼ਾ',
    ml: 'ആപ്പ് ഭാഷ',
    or: 'ଆପ୍ ଭାଷା',
    as: 'এপৰ ভাষা',
    ur: 'ایپ کی زبان',
    sa: 'अनुप्रयोग-भाषा',
    es: 'Idioma de la aplicación',
    ne: 'अनुप्रयोग भाषा'
  },
  selectLanguageDesc: {
    en: 'Select your preferred language for the interface',
    hi: 'इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें',
    bn: 'ইন্টারফেসের জন্য আপনার পছন্দের भाषा निर्वाचन गर्नुहोस्',
    te: 'ఇంటర్‌ఫేస్ కోసం మీ ప్రాధాన్య భాషను ఎంచుకోండి',
    mr: 'इंटरफेससाठी तुमची पसंतीची भाषा निवडा',
    ta: 'இடைமுகத்திற்கான உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    gu: 'ઇન્ટરફેસ માટે તમારી પસંદગીની ભાષા પસંદ કરો',
    kn: 'ಇಂಟರ್ಫೇಸ್ಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    pa: 'ਇੰਟਰਫੇਸ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    ml: 'ഇന്റർഫേസിനായി നിങ്ങളുടെ മുൻഗണനാ ഭാഷ തിരഞ്ഞെടുക്കുക',
    or: 'ଇଣ୍ଟରଫେସ୍ ପାଇଁ ଆପଣଙ୍କର ପସନ୍ଦିତ ଭାଷା ଚୟନ କରନ୍ତୁ',
    as: 'ইণ্টাৰফেচৰ বাবে আপোনাৰ পছন্দৰ ভাষা বাছনি কৰক',
    ur: 'انٹرفیس کے لیے اپنی پسندیدہ زبان منتخب کریں',
    sa: 'पसन्दयोग्यां भाषां चिनुत',
    es: 'Seleccione su idioma preferido para la interfaz',
    ne: 'इन्टरफेसको लागि आफ्नो मनपर्ने भाषा चयन गर्नुहोस्'
  },
  languageUpdated: {
    en: 'Language preference updated successfully!',
    hi: 'भाषा प्राथमिकता सफलतापूर्वक अपडेट की गई!',
    bn: 'ভাষা পছন্দ সফলভাবে আপডেট করা হয়েছে!',
    te: 'భాషా ప్రాధాన్యత విజయవంతంగా నవీకరించబడింది!',
    mr: 'भाषा प्राधान्य यशस्वीरित्या अपडेट केले!',
    ta: 'மொழி விருப்பம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
    gu: 'ભાષા પસંદગી સફળતાપૂર્વક અપડેટ થઈ!',
    kn: 'ಭಾಷಾ ಆದ್ಯತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
    pa: 'ਭਾਸ਼ਾ ਦੀ ਤਰਜੀਹ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਕੀਤੀ ਗਈ!',
    ml: 'ഭാഷാ മുൻഗണന വിജയകരമായി പുതുക്കി!',
    or: 'ଭାଷା ପସନ୍ଦ ସଫଳତାର ସହ ଅପଡେଟ୍ ହୋଇଛି!',
    as: 'ভাষাৰ পছন্দ সফলতাৰে উন্নীত কৰা হৈছে!',
    ur: 'زبان کی ترجیح کامیابی سے اپ ڈیٹ ہو گئی!',
    sa: 'भाषापरिवर्तनं ସଫଳମ୍!',
    es: '¡Preferencia de idioma actualizada con éxito!',
    ne: 'भाषा प्राथमिकता सफलतापूर्वक अपडेट गरियो!'
  },
  voiceGreeting: {
    en: 'Hello! I am Kisan Sahayak. You can ask me anything.',
    hi: 'नमस्ते! मैं किसान सहायक हूँ। आप मुझसे कुछ भी पूछ सकते हैं।',
    bn: 'নমস্কার! আমি কিষাণ সহায়ক। আপনি আমাকে যেকোনো প্রশ্ন করতে পারেন।',
    te: 'నమస్తే! నేను కిసాన్ సహాయక్. మీరు నన్ను ఏదైనా అడగవచ్చు.',
    mr: 'नमस्कार! मी किसान सहायक आहे. आपण मला काहीही विचारू शकता.',
    ta: 'வணக்கம்! நான் கிசான் சகாயக். நீங்கள் என்னிடம் எது வேண்டுமானாலும் கேட்கலாம்.',
    gu: 'નમસ્તે! હું કિસાન સહાયક છું. તમે મને કંઈ પણ પૂછી શકો છો.',
    kn: 'ನಮಸ್ತೆ! ನಾನು ಕಿಸಾನ್ ಸಹಾಯಕ್. ನೀವು ನನ್ನನ್ನು ಏನ ಬೇಕಾದರೂ ಕೇಳಬಹುದು.',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕਿਸਾਨ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ।',
    ml: 'നമസ്തേ! ഞാൻ കിസാൻ സഹായക്. നിങ്ങൾക്ക് എന്നോട് എന്തും ചോദിക്കാം.',
    or: 'ନମସ୍କାର! ମୁଁ କିଷାନ ସହାୟକ। ଆପଣ ମୋତେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରିପାରିବେ।',
    as: 'নমস্কাৰ! মই কিষাণ সহায়ক। আপুনি মোক যিকোনো প্ৰশ্ন সুধিব পাৰে।',
    ur: 'ہیلو! میں کسان معاون ہوں۔ آپ مجھ سے کچھ بھی پوچھ سکتے ہیں۔',
    sa: 'नमो नमः! अहं कृषकसहायकः। भवान् मां किमपि प्रष्टुं शक्नोति।',
    es: '¡Hola! Soy Kisan Sahayak. Puedes preguntarme cualquier cosa.',
    ne: 'नमस्ते! म किसान सहायक हुँ। तपाईं मलाई जे पनि सोध्न सक्नुहुन्छ।'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  changeLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('hi');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app_language') as LanguageCode;
    if (savedLanguage && translations.home[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
