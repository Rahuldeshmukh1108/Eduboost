// Enhanced Translation Service
class TranslationService {
    constructor() {
      this.currentLanguage = "en"
      this.translations = {
        en: {
          appTitle: "AI Tutor",
          newChat: "New Chat",
          conversationHistory: "Conversation History",
          settings: {
            language: "Language:",
            aiModel: "AI Model:",
            darkMode: "Dark Mode:",
            textToSpeech: "Text-to-Speech:",
          },
          chat: {
            welcome:
              "Hello! I'm your AI Tutor. I can help you learn about any subject. You can ask me questions, upload files, or even send me images and audio. How can I assist you today?",
            inputPlaceholder: "Type your message here...",
            send: "Send Message",
            voice: "Voice Input",
            upload: "Upload Files",
            processing: "Processing...",
            thinking: "Thinking...",
            error: "I'm sorry, I encountered an error: {0}. Please try again.",
            voiceEnabled: "Text-to-speech is now enabled. I will read my responses aloud.",
          },
          files: {
            pdf: "PDF",
            document: "Document",
            image: "Image",
            audio: "Audio",
            filePreview: "File Preview",
            extractedText: "Extracted Text:",
            detectedLabels: "Detected Labels:",
            detectedObjects: "Detected Objects:",
            noTextDetected: "No text detected in image",
            processingError: "There was an error processing your {0} file. Please try again with a different file.",
          },
          audio: {
            recording: "Audio Recording",
            start: "Start",
            stop: "Stop",
            send: "Send",
          },
          profile: {
            title: "User Profile",
            guest: "Guest User",
            guestMode: "Using AI Tutor in guest mode",
            statistics: "Statistics",
            conversations: "Conversations:",
            messages: "Messages:",
            close: "Close",
          },
          actions: {
            share: "Share",
            rename: "Rename",
            favorite: "Favorite",
            delete: "Delete",
            confirmDelete: "Are you sure you want to delete this message?",
          },
        },
        es: {
          appTitle: "Tutor de IA",
          newChat: "Nueva Conversación",
          conversationHistory: "Historial de Conversaciones",
          settings: {
            language: "Idioma:",
            aiModel: "Modelo de IA:",
            darkMode: "Modo Oscuro:",
            textToSpeech: "Texto a Voz:",
          },
          chat: {
            welcome:
              "¡Hola! Soy tu Tutor de IA. Puedo ayudarte a aprender sobre cualquier tema. Puedes hacerme preguntas, subir archivos o incluso enviarme imágenes y audio. ¿Cómo puedo ayudarte hoy?",
            inputPlaceholder: "Escribe tu mensaje aquí...",
            send: "Enviar Mensaje",
            voice: "Entrada de Voz",
            upload: "Subir Archivos",
            processing: "Procesando...",
            thinking: "Pensando...",
            error: "Lo siento, encontré un error: {0}. Por favor, inténtalo de nuevo.",
          },
          files: {
            pdf: "PDF",
            document: "Documento",
            image: "Imagen",
            audio: "Audio",
            filePreview: "Vista Previa del Archivo",
            extractedText: "Texto Extraído:",
            detectedLabels: "Etiquetas Detectadas:",
            detectedObjects: "Objetos Detectados:",
            noTextDetected: "No se detectó texto en la imagen",
            processingError: "Hubo un error al procesar tu archivo {0}. Por favor, intenta con un archivo diferente.",
          },
          audio: {
            recording: "Grabación de Audio",
            start: "Iniciar",
            stop: "Detener",
            send: "Enviar",
          },
          profile: {
            title: "Perfil de Usuario",
            guest: "Usuario Invitado",
            guestMode: "Usando Tutor de IA en modo invitado",
            statistics: "Estadísticas",
            conversations: "Conversaciones:",
            messages: "Mensajes:",
            close: "Cerrar",
          },
          actions: {
            share: "Compartir",
            rename: "Renombrar",
            favorite: "Favorito",
            delete: "Eliminar",
            confirmDelete: "¿Estás seguro de que quieres eliminar este mensaje?",
          },
        },
        fr: {
          appTitle: "Tuteur IA",
          newChat: "Nouvelle Conversation",
          conversationHistory: "Historique des Conversations",
          settings: {
            language: "Langue:",
            aiModel: "Modèle IA:",
            darkMode: "Mode Sombre:",
            textToSpeech: "Synthèse Vocale:",
          },
          chat: {
            welcome:
              "Bonjour! Je suis votre Tuteur IA. Je peux vous aider à apprendre sur n'importe quel sujet. Vous pouvez me poser des questions, télécharger des fichiers, ou même m'envoyer des images et des audios. Comment puis-je vous aider aujourd'hui?",
            inputPlaceholder: "Tapez votre message ici...",
            send: "Envoyer Message",
            voice: "Entrée Vocale",
            upload: "Télécharger Fichiers",
            processing: "Traitement...",
            thinking: "Réflexion...",
            error: "Je suis désolé, j'ai rencontré une erreur: {0}. Veuillez réessayer.",
          },
          files: {
            pdf: "PDF",
            document: "Document",
            image: "Image",
            filePreview: "Aperçu du Fichier",
            extractedText: "Texte Extrait:",
            detectedLabels: "Étiquettes Détectées:",
            detectedObjects: "Objets Détectés:",
            noTextDetected: "Aucun texte détecté dans l'image",
            processingError:
              "Une erreur est survenue lors du traitement de votre fichier {0}. Veuillez essayer avec un autre fichier.",
          },
          audio: {
            recording: "Enregistrement Audio",
            start: "Démarrer",
            stop: "Arrêter",
            send: "Envoyer",
          },
          profile: {
            title: "Profil d'Utilisateur",
            guest: "Utilisateur Invité",
            guestMode: "Utilisation du Tuteur IA en mode invité",
            statistics: "Statistiques",
            conversations: "Conversations:",
            messages: "Messages:",
            close: "Fermer",
          },
          actions: {
            share: "Partager",
            rename: "Renommer",
            favorite: "Favori",
            delete: "Supprimer",
            confirmDelete: "Êtes-vous sûr de vouloir supprimer ce message?",
          },
        },
        hi: {
          appTitle: "AI शिक्षक",
          newChat: "नई बातचीत",
          conversationHistory: "बातचीत का इतिहास",
          settings: {
            language: "भाषा:",
            aiModel: "AI मॉडल:",
            darkMode: "डार्क मोड:",
            textToSpeech: "टेक्स्ट से स्पीच:",
          },
          chat: {
            welcome:
              "नमस्ते! मैं आपका AI शिक्षक हूँ। मैं आपको किसी भी विषय के बारे में सीखने में मदद कर सकता हूँ। आप मुझसे प्रश्न पूछ सकते हैं, फ़ाइलें अपलोड कर सकते हैं, या यहां तक कि मुझे छवियां और ऑडियो भी भेज सकते हैं। मैं आज आपकी कैसे सहायता कर सकता हूँ?",
            inputPlaceholder: "अपना संदेश यहां लिखें...",
            send: "संदेश भेजें",
            voice: "आवाज इनपुट",
            upload: "फ़ाइलें अपलोड करें",
            processing: "प्रोसेसिंग...",
            thinking: "सोच रहा हूँ...",
            error: "क्षमा करें, मुझे एक त्रुटि मिली: {0}। कृपया पुनः प्रयास करें।",
          },
          files: {
            pdf: "PDF",
            document: "Document",
            image: "Image",
            audio: "Audio",
            filePreview: "फ़ाइल पूर्वावलोकन",
            extractedText: "निकाला गया पाठ:",
            detectedLabels: "पता लगाए गए लेबल:",
            detectedObjects: "पता लगाए गए ऑब्जेक्ट:",
            noTextDetected: "छवि में कोई पाठ नहीं मिला",
            processingError: "आपकी {0} फ़ाइल को संसाधित करने में एक त्रुटि हुई। कृपया किसी भिन्न फ़ाइल के साथ पुनः प्रयास करें।",
          },
          audio: {
            recording: "ऑडियो रिकॉर्डिंग",
            start: "शुरू",
            stop: "बंद करो",
            send: "भेजें",
          },
          profile: {
            title: "उपयोगकर्ता प्रोफ़ाइल",
            guest: "अतिथि उपयोगकर्ता",
            guestMode: "अतिथि मोड में AI शिक्षक का उपयोग करना",
            statistics: "आंकड़े",
            conversations: "बातचीत:",
            messages: "संदेश:",
            close: "बंद करे",
          },
          actions: {
            share: "साझा करें",
            rename: "नाम बदलें",
            favorite: "पसंदीदा",
            delete: "हटाएं",
            confirmDelete: "क्या आप वाकई इस संदेश को हटाना चाहते हैं?",
          },
        },
        mr: {
          appTitle: "AI शिक्षक",
          newChat: "नवीन संभाषण",
          conversationHistory: "संभाषण इतिहास",
          settings: {
            language: "भाषा:",
            aiModel: "AI मॉडेल:",
            darkMode: "डार्क मोड:",
            textToSpeech: "मजकूर ते वाणी:",
          },
          chat: {
            welcome:
              "नमस्कार! मी तुमचा AI शिक्षक आहे. मी तुम्हाला कोणत्याही विषयाबद्दल शिकण्यास मदत करू शकतो. तुम्ही मला प्रश्न विचारू शकता, फाइल्स अपलोड करू शकता, किंवा मला चित्रे आणि ऑडिओ देखील पाठवू शकता. मी आज तुमची कशी मदत करू शकतो?",
            inputPlaceholder: "तुमचा संदेश येथे टाइप करा...",
            send: "संदेश पाठवा",
            voice: "आवाज इनपुट",
            upload: "फाइल्स अपलोड करा",
            processing: "प्रक्रिया करत आहे...",
            thinking: "विचार करत आहे...",
            error: "क्षमस्व, मला एक त्रुटी आढळली: {0}. कृपया पुन्हा प्रयत्न करा.",
          },
          files: {
            pdf: "PDF",
            document: "दस्तऐवज",
            image: "प्रतिमा",
            audio: "ऑडिओ",
            filePreview: "फाइल पूर्वावलोकन",
            extractedText: "काढलेला मजकूर:",
            detectedLabels: "शोधलेले लेबल्स:",
            detectedObjects: "शोधलेल्या वस्तू:",
            noTextDetected: "प्रतिमेमध्ये कोणताही मजकूर आढळला नाही",
            processingError: "तुमची {0} फाइल प्रक्रिया करताना एक त्रुटी आली. कृपया दुसर्‍या फाइलसह पुन्हा प्रयत्न करा.",
          },
          audio: {
            recording: "ऑडिओ रेकॉर्डिंग",
            start: "सुरू करा",
            stop: "थांबा",
            send: "पाठवा",
          },
          profile: {
            title: "वापरकर्ता प्रोफाइल",
            guest: "अतिथि वापरकर्ता",
            guestMode: "अतिथि मोडमध्ये AI शिक्षक वापरणे",
            statistics: "आकडेवारी",
            conversations: "संभाषणे:",
            messages: "संदेश:",
            close: "बंद करा",
          },
          actions: {
            share: "सामायिक करा",
            rename: "पुनर्नामित करा",
            favorite: "आवडते",
            delete: "हटवा",
            confirmDelete: "तुम्ही हा संदेश हटवू इच्छिता?",
          },
        },
        gu: {
          appTitle: "AI શિક્ષક",
          newChat: "નવી વાતચીત",
          conversationHistory: "વાતચીત ઇતિહાસ",
          settings: {
            language: "ભાષા:",
            aiModel: "AI મોડેલ:",
            darkMode: "ડાર્ક મોડ:",
            textToSpeech: "ટેક્સ્ટ થી સ્પીચ:",
          },
          chat: {
            welcome:
              "નમસ્તે! હું તમારો AI શિક્ષક છું. હું તમને કોઈપણ વિષય વિશે શીખવામાં મદદ કરી શકું છું. તમે મને પ્રશ્નો પૂછી શકો છો, ફાઇલો અપલોડ કરી શકો છો, અથવા મને છબીઓ અને ઓડિયો પણ મોકલી શકો છો. હું આજે તમારી કેવી રીતે મદદ કરી શકું?",
            inputPlaceholder: "તમારો સંદેશ અહીં લખો...",
            send: "સંદેશ મોકલો",
            voice: "વૉઇસ ઇનપુટ",
            upload: "ફાઇલો અપલોડ કરો",
            processing: "પ્રોસેસિંગ...",
            thinking: "વિચારી રહ્યો છું...",
            error: "માફ કરશો, મને એક ભૂલ મળી: {0}. કૃપા કરીને ફરી પ્રયાસ કરો.",
          },
          files: {
            pdf: "PDF",
            document: "દસ્તાવેજ",
            image: "છબી",
            audio: "ઓડિયો",
            filePreview: "ફાઇલ પૂર્વાવલોકન",
            extractedText: "કાઢવામાં આવેલો ટેક્સ્ટ:",
            detectedLabels: "શોધાયેલ લેબલ્સ:",
            detectedObjects: "શોધાયેલ ઑબ્જેક્ટ્સ:",
            noTextDetected: "છબીમાં કોઈ ટેક્સ્ટ શોધાયો નથી",
            processingError: "તમારી {0} ફાઇલ પ્રોસેસ કરવામાં એક ભૂલ આવી. કૃપા કરીને એક અલગ ફાઇલ સાથે ફરી પ્રયાસ કરો.",
          },
          audio: {
            recording: "ઓડિયો રેકોર્ડિંગ",
            start: "શરૂ કરો",
            stop: "બંધ કરો",
            send: "મોકલો",
          },
          profile: {
            title: "વપરાશકર્તા પ્રોફાઇલ",
            guest: "મહેમાન વપરાશકર્તા",
            guestMode: "મહેમાન મોડમાં AI શિક્ષકનો ઉપયોગ કરવો",
            statistics: "આંકડા",
            conversations: "વાતચીતો:",
            messages: "સંદેશાઓ:",
            close: "બંધ કરો",
          },
          actions: {
            share: "શેર કરો",
            rename: "નામ બદલો",
            favorite: "મનપસંદ",
            delete: "કાઢી નાખો",
            confirmDelete: "શું તમે આ સંદેશને કાઢી નાખવા માંગો છો?",
          },
        },
        ta: {
          appTitle: "AI ஆசிரியர்",
          newChat: "புதிய உரையாடல்",
          conversationHistory: "உரையாடல் வரலாறு",
          settings: {
            language: "மொழி:",
            aiModel: "AI மாடல்:",
            darkMode: "இருள் பயன்முறை:",
            textToSpeech: "உரை-முதல்-பேச்சு:",
          },
          chat: {
            welcome:
              "வணக்கம்! நான் உங்கள் AI ஆசிரியர். எந்த பொருளைப் பற்றியும் கற்றுக்கொள்ள நான் உங்களுக்கு உதவ முடியும். நீங்கள் என்னிடம் கேள்விகள் கேட்கலாம், கோப்புகளை பதிவேற்றலாம், அல்லது படங்கள் மற்றும் ஆடியோவையும் அனுப்பலாம். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
            inputPlaceholder: "உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்...",
            send: "செய்தி அனுப்பு",
            voice: "குரல் உள்ளீடு",
            upload: "கோப்புகளை பதிவேற்று",
            processing: "செயலாக்குகிறது...",
            thinking: "சிந்திக்கிறேன்...",
            error: "மன்னிக்கவும், எனக்கு ஒரு பிழை ஏற்பட்டது: {0}. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
          },
          files: {
            pdf: "PDF",
            document: "ஆவணம்",
            image: "படம்",
            audio: "ஆடியோ",
            filePreview: "கோப்பு முன்னோட்டம்",
            extractedText: "பிரித்தெடுக்கப்பட்ட உரை:",
            detectedLabels: "கண்டறியப்பட்ட லேபிள்கள்:",
            detectedObjects: "கண்டறியப்பட்ட பொருள்கள்:",
            noTextDetected: "படத்தில உரை எதுவும் கண்டறியப்படவில்லை",
            processingError: "உங்கள் {0} கோப்பைச் செயலாக்குவதில் பிழை ஏற்பட்டது. வேறு கோப்பைக் கொண்டு மீண்டும் முயற்சிக்கவும்.",
          },
          audio: {
            recording: "ஆடியோ பதிவு",
            start: "தொடங்கு",
            stop: "நிறுத்து",
            send: "அனுப்பு",
          },
          profile: {
            title: "பயனர் விவரம்",
            guest: "விருந்தினர் பயனர்",
            guestMode: "விருந்தினர் முறையில் AI ஆசிரியரைப் பயன்படுத்துதல்",
            statistics: "புள்ளிவிவரங்கள்",
            conversations: "உரையாடல்கள்:",
            messages: "செய்திகள்:",
            close: "மூடு",
          },
          actions: {
            share: "பகிர்",
            rename: "மறுபெயரிடு",
            favorite: "பிடித்தவை",
            delete: "நீக்கு",
            confirmDelete: "இந்த செய்தியை நீக்க வேண்டுமா?",
          },
        },
        ml: {
          appTitle: "AI അദ്ധ്യാപകൻ",
          newChat: "പുതിയ സംഭാഷണം",
          conversationHistory: "സംഭാഷണ ചരിത്രം",
          settings: {
            language: "ഭാഷ:",
            aiModel: "AI മോഡൽ:",
            darkMode: "ഇരുണ്ട മോഡ്:",
            textToSpeech: "ടെക്സ്റ്റ്-ടു-സ്പീച്ച്:",
          },
          chat: {
            welcome:
              "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI അദ്ധ്യാപകനാണ്. ഏതെങ്കിലും വിഷയത്തെക്കുറിച്ച് പഠിക്കാൻ എനിക്ക് നിങ്ങളെ സഹായിക്കാൻ കഴിയും. നിങ്ങൾക്ക് എന്നോട് ചോദ്യങ്ങൾ ചോദിക്കാം, ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യാം, അല്ലെങ്കിൽ ചിത്രങ്ങളും ഓഡിയോയും എനിക്ക് അയയ്ക്കാം. ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?",
            inputPlaceholder: "നിങ്ങളുടെ സന്ദേശം ഇവിടെ ടൈപ്പ് ചെയ്യുക...",
            send: "സന്ദേശം അയയ്ക്കുക",
            voice: "വോയ്സ് ഇൻപുട്ട്",
            upload: "ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യുക",
            processing: "പ്രോസസ്സ് ചെയ്യുന്നു...",
            thinking: "ചിന്തിക്കുന്നു...",
            error: "ക്ഷമിക്കണം, എനിക്ക് ഒരു പിശക് കണ്ടെത്തി: {0}. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
          },
          files: {
            pdf: "PDF",
            document: "പ്രമാണം",
            image: "ചിത്രം",
            audio: "ഓഡിയോ",
            filePreview: "ഫയൽ പ്രിവ്യൂ",
            extractedText: "വേർതിരിച്ച വാചകം:",
            detectedLabels: "കണ്ടെത്തിയ ലേബലുകൾ:",
            detectedObjects: "കണ്ടെത്തിയ ഒബ്ജക്റ്റുകൾ:",
            noTextDetected: "ചിത്രത്തിൽ ടെക്സ്റ്റ് കണ്ടെത്തിയില്ല",
            processingError: "നിങ്ങളുടെ {0} ഫയൽ പ്രോസസ്സ് ചെയ്യുന്നതിൽ ഒരു പിശക് സംഭവിച്ചു. ദയവായി മറ്റൊരു ഫയൽ ഉപയോഗിച്ച് വീണ്ടും ശ്രമിക്കുക.",
          },
          audio: {
            recording: "ഓഡിയോ റെക്കോർഡിംഗ്",
            start: "ആരംഭിക്കുക",
            stop: "നിർത്തുക",
            send: "അയയ്ക്കുക",
          },
          profile: {
            title: "ഉപയോക്തൃ പ്രൊഫൈൽ",
            guest: "അതിഥി ഉപയോക്താവ്",
            guestMode: "അതിഥി മോഡിൽ AI അദ്ധ്യാപകൻ ഉപയോഗിക്കുന്നു",
            statistics: "സ്ഥിതിവിവരക്കണക്കുകൾ",
            conversations: "സംഭാഷണങ്ങൾ:",
            messages: "സന്ദേശങ്ങൾ:",
            close: "അടയ്ക്കുക",
          },
          actions: {
            share: "പങ്കിടുക",
            rename: "പേരുമാറ്റുക",
            favorite: "പ്രിയപ്പെട്ടവ",
            delete: "ഇല്ലാതാക്കുക",
            confirmDelete: "നിങ്ങൾക്ക് ഈ സന്ദേശം ഇല്ലാതാക്കണോ?",
          },
        },
      }
  
      console.log("TranslationService initialized")
    }
  
    setLanguage(language) {
      if (this.translations[language]) {
        this.currentLanguage = language
        this.updateUILanguage()
        return true
      }
      return false
    }
  
    getText(key, defaultText = "") {
      const keys = key.split(".")
      let value = this.translations[this.currentLanguage]
  
      for (const k of keys) {
        if (value && value[k] !== undefined) {
          value = value[k]
        } else {
          return defaultText
        }
      }
  
      return value
    }
  
    formatText(key, ...args) {
      let text = this.getText(key)
  
      args.forEach((arg, index) => {
        text = text.replace(`{${index}}`, arg)
      })
  
      return text
    }
  
    updateUILanguage() {
      // Update app title
      const sidebarHeader = document.querySelector(".sidebar-header h2")
      if (sidebarHeader) {
        sidebarHeader.textContent = this.getText("appTitle")
      }
  
      const chatHeader = document.querySelector(".chat-header h2")
      if (chatHeader) {
        chatHeader.textContent = this.getText("appTitle") + " Chat"
      }
  
      // Update new chat button
      const newChatButton = document.querySelector("#new-chat-button")
      if (newChatButton) {
        newChatButton.innerHTML = `<i class="fas fa-plus"></i> ${this.getText("newChat")}`
      }
  
      // Update conversation history title
      const conversationHistory = document.querySelector(".conversation-history h3")
      if (conversationHistory) {
        conversationHistory.textContent = this.getText("conversationHistory")
      }
  
      // Update settings labels
      const languageLabel = document.querySelector('label[for="language-select"]')
      if (languageLabel) {
        languageLabel.textContent = this.getText("settings.language")
      }
  
      const modelLabel = document.querySelector('label[for="model-select"]')
      if (modelLabel) {
        modelLabel.textContent = this.getText("settings.aiModel")
      }
  
      const themeLabel = document.querySelector('label[for="theme-toggle"]')
      if (themeLabel) {
        themeLabel.textContent = this.getText("settings.darkMode")
      }
  
      const voiceLabel = document.querySelector('label[for="voice-toggle"]')
      if (voiceLabel) {
        voiceLabel.textContent = this.getText("settings.textToSpeech")
      }
  
      // Update input placeholder
      const userInput = document.querySelector("#user-input")
      if (userInput) {
        userInput.placeholder = this.getText("chat.inputPlaceholder")
      }
  
      // Update button titles
      const sendButton = document.querySelector("#send-button")
      if (sendButton) {
        sendButton.title = this.getText("chat.send")
      }
  
      const voiceButton = document.querySelector("#voice-input-button")
      if (voiceButton) {
        voiceButton.title = this.getText("chat.voice")
      }
  
      const fileButton = document.querySelector("#file-upload-button")
      if (fileButton) {
        fileButton.title = this.getText("chat.upload")
      }
  
      // Update file upload options
      const fileOptions = document.querySelectorAll(".file-option")
      if (fileOptions.length >= 4) {
        fileOptions[0].innerHTML = `<i class="fas fa-file-pdf"></i> ${this.getText("files.pdf")}
                  <input type="file" id="pdf-upload" accept=".pdf" hidden>`
  
        fileOptions[1].innerHTML = `<i class="fas fa-file-word"></i> ${this.getText("files.document")}
                  <input type="file" id="doc-upload" accept=".doc,.docx,.txt" hidden>`
  
        fileOptions[2].innerHTML = `<i class="fas fa-image"></i> ${this.getText("files.image")}
                  <input type="file" id="image-upload" accept="image/*" hidden>`
  
        fileOptions[3].innerHTML = `<i class="fas fa-music"></i> ${this.getText("files.audio")}
                  <input type="file" id="audio-upload" accept="audio/*" hidden>`
      }
  
      // Update file preview header
      const filePreviewHeader = document.querySelector(".file-preview-header h3")
      if (filePreviewHeader) {
        filePreviewHeader.textContent = this.getText("files.filePreview")
      }
  
      // Update audio recording UI
      const audioRecordingHeader = document.querySelector(".audio-recording-header h3")
      if (audioRecordingHeader) {
        audioRecordingHeader.textContent = this.getText("audio.recording")
      }
  
      const startRecording = document.querySelector("#start-recording")
      if (startRecording) {
        startRecording.innerHTML = `<i class="fas fa-microphone"></i> ${this.getText("audio.start")}`
      }
  
      const stopRecording = document.querySelector("#stop-recording")
      if (stopRecording) {
        stopRecording.innerHTML = `<i class="fas fa-stop"></i> ${this.getText("audio.stop")}`
      }
  
      const sendAudio = document.querySelector("#send-audio")
      if (sendAudio) {
        sendAudio.innerHTML = `<i class="fas fa-paper-plane"></i> ${this.getText("audio.send")}`
      }
  
      // Update loading text
      const loadingText = document.querySelector("#loading-text")
      if (loadingText) {
        loadingText.textContent = this.getText("chat.processing")
      }
    }
  }
  
  // Initialize translation service
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing TranslationService")
    window.translationService = new TranslationService()
  })
  