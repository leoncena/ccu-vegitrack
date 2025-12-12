import { useMemo } from 'react'
import { useMenu, type LanguageOption } from '../contexts/MenuContext'

type TemplateValues = Record<string, string | number | undefined>

export type TranslationKey =
  | 'menu.title'
  | 'menu.recentScans'
  | 'menu.favorites'
  | 'menu.myAccount'
  | 'menu.language'
  | 'menu.login'
  | 'menu.logout'
  | 'menu.blockchainAssurance'
  | 'recent.title'
  | 'recent.loginTitle'
  | 'recent.loginBody'
  | 'recent.loginCta'
  | 'recent.empty'
  | 'account.title'
  | 'account.loggedOutTitle'
  | 'account.loggedOutBody'
  | 'account.loginCta'
  | 'account.detailsTitle'
  | 'account.email'
  | 'account.userId'
  | 'account.securityTitle'
  | 'account.changePassword'
  | 'account.deleteAccount'
  | 'account.deleteAccountDisabled'
  | 'account.logout'
  | 'food.loading'
  | 'food.notFoundTitle'
  | 'food.notFoundBody'
  | 'food.backToScanner'
  | 'food.details'
  | 'food.alternatives'
  | 'food.noAlternatives'
  | 'food.stat.harvested'
  | 'food.stat.transport'
  | 'food.stat.emissions'
  | 'food.stat.price'
  | 'food.section.origin'
  | 'food.section.certifications'
  | 'food.section.farming'
  | 'food.section.farmer'
  | 'food.section.recipes'
  | 'food.productId'
  | 'start.title'
  | 'start.tagline'
  | 'start.description'
  | 'start.selectStore'
  | 'start.storePlaceholder'
  | 'start.storeSearchPlaceholder'
  | 'start.storeEmpty'
  | 'start.cta'
  | 'start.loginRegister'
  | 'start.signedInAs'
  | 'start.logout'
  | 'scan.title'
  | 'scan.tip'
  | 'scan.manualTitle'
  | 'scan.placeholder'
  | 'scan.searchPlaceholder'
  | 'scan.empty'
  | 'scan.openButton'
  | 'scan.loadingButton'
  | 'scan.invalidQr'
  | 'scan.openError'

const translations: Record<LanguageOption, Record<TranslationKey, string>> = {
  'en-US': {
    'menu.title': 'Menu',
    'menu.recentScans': 'Recent Scans',
    'menu.favorites': 'Favorites',
    'menu.myAccount': 'My Account',
    'menu.language': 'Language',
    'menu.login': 'Log In',
    'menu.logout': 'Log Out',
    'menu.blockchainAssurance': 'Blockchain Assurance',
    'recent.title': 'Recent Scans',
    'recent.loginTitle': 'Login to view your scans',
    'recent.loginBody': 'Keep track of your last scans across devices by signing in.',
    'recent.loginCta': 'Go to Login',
    'recent.empty': 'You have not scanned any products yet.',
    'account.title': 'My Account',
    'account.loggedOutTitle': 'You are not logged in',
    'account.loggedOutBody': 'Sign in to manage your account and saved items.',
    'account.loginCta': 'Go to Login',
    'account.detailsTitle': 'Account Details',
    'account.email': 'Email:',
    'account.userId': 'User ID:',
    'account.securityTitle': 'Security',
    'account.changePassword': 'Change Password',
    'account.deleteAccount': 'Delete Account',
    'account.deleteAccountDisabled': 'Account deletion is disabled in this demo environment.',
    'account.logout': 'Log Out',
    'food.loading': 'Loading product...',
    'food.notFoundTitle': 'Product Not Found',
    'food.notFoundBody': "We couldn't find this product. Please try scanning again.",
    'food.backToScanner': 'Back to Scanner',
    'food.details': 'Details',
    'food.alternatives': 'Alternatives',
    'food.noAlternatives': 'No alternatives available',
    'food.stat.harvested': 'Harvested',
    'food.stat.transport': 'Transport',
    'food.stat.emissions': 'Emissions',
    'food.stat.price': 'Price',
    'food.section.origin': 'Origin & Transportation',
    'food.section.certifications': 'Certifications & Quality',
    'food.section.farming': 'Farming Practices',
    'food.section.farmer': 'Farmer Story',
    'food.section.recipes': 'Cultural Recipes',
    'food.productId': 'ID {id}',
    'start.title': 'VegiTrack',
    'start.tagline': 'Know your veggies',
    'start.description': 'Scan fresh fruits and vegetables to explore its Food Passport – origin, transport, quality and sustainability aspects.',
    'start.selectStore': 'Select your Store:',
    'start.storePlaceholder': 'Select a store...',
    'start.storeSearchPlaceholder': 'Search stores...',
    'start.storeEmpty': 'No store found.',
    'start.cta': 'Start Scanning',
    'start.loginRegister': 'Login/Register',
    'start.signedInAs': 'Signed in as {email}',
    'start.logout': '(Click to logout)',
    'scan.title': 'Scan a Product',
    'scan.tip': '🍅 Position the QR code inside the frame. Scanning starts automatically.',
    'scan.manualTitle': 'Find your product without QR code',
    'scan.placeholder': 'Select your product...',
    'scan.searchPlaceholder': 'Search products...',
    'scan.empty': 'No products found.',
    'scan.openButton': 'Open selected product',
    'scan.loadingButton': 'Opening...',
    'scan.invalidQr': 'Invalid QR code. Please try again.',
    'scan.openError': 'Could not open product. Please try again.',
  },
  'pt-PT': {
    'menu.title': 'Menu',
    'menu.recentScans': 'Leituras Recentes',
    'menu.favorites': 'Favoritos',
    'menu.myAccount': 'A Minha Conta',
    'menu.language': 'Idioma',
    'menu.login': 'Iniciar sessão',
    'menu.logout': 'Terminar sessão',
    'menu.blockchainAssurance': 'Garantia Blockchain',
    'recent.title': 'Leituras Recentes',
    'recent.loginTitle': 'Inicie sessão para ver as suas leituras',
    'recent.loginBody': 'Guarde as suas últimas leituras em todos os dispositivos iniciando sessão.',
    'recent.loginCta': 'Ir para Login',
    'recent.empty': 'Ainda não leu nenhum produto.',
    'account.title': 'A Minha Conta',
    'account.loggedOutTitle': 'Não tem sessão iniciada',
    'account.loggedOutBody': 'Inicie sessão para gerir a sua conta e itens guardados.',
    'account.loginCta': 'Ir para Login',
    'account.detailsTitle': 'Detalhes da Conta',
    'account.email': 'Email:',
    'account.userId': 'ID de Utilizador:',
    'account.securityTitle': 'Segurança',
    'account.changePassword': 'Alterar Palavra-passe',
    'account.deleteAccount': 'Eliminar Conta',
    'account.deleteAccountDisabled': 'A eliminação está desativada neste ambiente de demonstração.',
    'account.logout': 'Terminar sessão',
    'food.loading': 'A carregar produto...',
    'food.notFoundTitle': 'Produto não encontrado',
    'food.notFoundBody': 'Não encontrámos este produto. Tente voltar a efetuar a leitura.',
    'food.backToScanner': 'Voltar ao leitor',
    'food.details': 'Detalhes',
    'food.alternatives': 'Alternativas',
    'food.noAlternatives': 'Sem alternativas disponíveis',
    'food.stat.harvested': 'Colheita',
    'food.stat.transport': 'Transporte',
    'food.stat.emissions': 'Emissões',
    'food.stat.price': 'Preço',
    'food.section.origin': 'Origem e Transporte',
    'food.section.certifications': 'Certificações e Qualidade',
    'food.section.farming': 'Práticas Agrícolas',
    'food.section.farmer': 'História do Agricultor',
    'food.section.recipes': 'Receitas Culturais',
    'food.productId': 'ID {id}',
    'start.title': 'VegiTrack',
    'start.tagline': 'Conheça os seus vegetais',
    'start.description': 'Leia frutas e legumes frescos para explorar o Food Passport – origem, transporte, qualidade e sustentabilidade.',
    'start.selectStore': 'Selecione a sua loja:',
    'start.storePlaceholder': 'Selecione uma loja...',
    'start.storeSearchPlaceholder': 'Procurar lojas...',
    'start.storeEmpty': 'Nenhuma loja encontrada.',
    'start.cta': 'Iniciar leitura',
    'start.loginRegister': 'Iniciar sessão / Registar',
    'start.signedInAs': 'Sessão iniciada como {email}',
    'start.logout': '(Clique para terminar sessão)',
    'scan.title': 'Ler um produto',
    'scan.tip': '🍅 Posicione o QR dentro da moldura. A leitura começa automaticamente.',
    'scan.manualTitle': 'Encontre o produto sem QR code',
    'scan.placeholder': 'Selecione o produto...',
    'scan.searchPlaceholder': 'Procurar produtos...',
    'scan.empty': 'Nenhum produto encontrado.',
    'scan.openButton': 'Abrir produto selecionado',
    'scan.loadingButton': 'A abrir...',
    'scan.invalidQr': 'QR inválido. Tente novamente.',
    'scan.openError': 'Não foi possível abrir o produto. Tente novamente.',
  },
  'de-DE': {
    'menu.title': 'Menü',
    'menu.recentScans': 'Letzte Scans',
    'menu.favorites': 'Favoriten',
    'menu.myAccount': 'Mein Konto',
    'menu.language': 'Sprache',
    'menu.login': 'Anmelden',
    'menu.logout': 'Abmelden',
    'menu.blockchainAssurance': 'Blockchain-Garantie',
    'recent.title': 'Letzte Scans',
    'recent.loginTitle': 'Melde dich an, um deine Scans zu sehen',
    'recent.loginBody': 'Behalte deine letzten Scans geräteübergreifend im Blick, indem du dich anmeldest.',
    'recent.loginCta': 'Zum Login',
    'recent.empty': 'Du hast noch keine Produkte gescannt.',
    'account.title': 'Mein Konto',
    'account.loggedOutTitle': 'Du bist nicht angemeldet',
    'account.loggedOutBody': 'Melde dich an, um dein Konto und gespeicherte Elemente zu verwalten.',
    'account.loginCta': 'Zum Login',
    'account.detailsTitle': 'Kontodetails',
    'account.email': 'E-Mail:',
    'account.userId': 'Benutzer-ID:',
    'account.securityTitle': 'Sicherheit',
    'account.changePassword': 'Passwort ändern',
    'account.deleteAccount': 'Konto löschen',
    'account.deleteAccountDisabled': 'Das Löschen ist in dieser Demo deaktiviert.',
    'account.logout': 'Abmelden',
    'food.loading': 'Produkt wird geladen...',
    'food.notFoundTitle': 'Produkt nicht gefunden',
    'food.notFoundBody': 'Wir konnten dieses Produkt nicht finden. Bitte erneut scannen.',
    'food.backToScanner': 'Zurück zum Scanner',
    'food.details': 'Details',
    'food.alternatives': 'Alternativen',
    'food.noAlternatives': 'Keine Alternativen verfügbar',
    'food.stat.harvested': 'Geerntet',
    'food.stat.transport': 'Transport',
    'food.stat.emissions': 'Emissionen',
    'food.stat.price': 'Preis',
    'food.section.origin': 'Herkunft & Transport',
    'food.section.certifications': 'Zertifizierungen & Qualität',
    'food.section.farming': 'Anbaumethoden',
    'food.section.farmer': 'Geschichte des Bauern',
    'food.section.recipes': 'Kulturelle Rezepte',
    'food.productId': 'ID {id}',
    'start.title': 'VegiTrack',
    'start.tagline': 'Kenn deine Gemüse',
    'start.description': 'Scanne frisches Obst und Gemüse, um den Food Passport mit Herkunft, Transport, Qualität und Nachhaltigkeit zu entdecken.',
    'start.selectStore': 'Wähle deinen Markt:',
    'start.storePlaceholder': 'Markt auswählen...',
    'start.storeSearchPlaceholder': 'Märkte durchsuchen...',
    'start.storeEmpty': 'Kein Markt gefunden.',
    'start.cta': 'Scan starten',
    'start.loginRegister': 'Anmelden/Registrieren',
    'start.signedInAs': 'Angemeldet als {email}',
    'start.logout': '(Zum Abmelden klicken)',
    'scan.title': 'Ein Produkt scannen',
    'scan.tip': '🍅 Platziere den QR-Code im Rahmen. Der Scan startet automatisch.',
    'scan.manualTitle': 'Produkt ohne QR-Code finden',
    'scan.placeholder': 'Wähle dein Produkt...',
    'scan.searchPlaceholder': 'Produkte durchsuchen...',
    'scan.empty': 'Keine Produkte gefunden.',
    'scan.openButton': 'Ausgewähltes Produkt öffnen',
    'scan.loadingButton': 'Öffnen...',
    'scan.invalidQr': 'Ungültiger QR-Code. Bitte erneut versuchen.',
    'scan.openError': 'Produkt konnte nicht geöffnet werden. Bitte erneut versuchen.',
  },
  'sv-SE': {
    'menu.title': 'Meny',
    'menu.recentScans': 'Senaste skanningar',
    'menu.favorites': 'Favoriter',
    'menu.myAccount': 'Mitt konto',
    'menu.language': 'Språk',
    'menu.login': 'Logga in',
    'menu.logout': 'Logga ut',
    'menu.blockchainAssurance': 'Blockchain-garanti',
    'recent.title': 'Senaste skanningar',
    'recent.loginTitle': 'Logga in för att se dina skanningar',
    'recent.loginBody': 'Håll koll på dina senaste skanningar på alla enheter genom att logga in.',
    'recent.loginCta': 'Gå till inloggning',
    'recent.empty': 'Du har inte skannat några produkter ännu.',
    'account.title': 'Mitt konto',
    'account.loggedOutTitle': 'Du är inte inloggad',
    'account.loggedOutBody': 'Logga in för att hantera ditt konto och sparade objekt.',
    'account.loginCta': 'Gå till inloggning',
    'account.detailsTitle': 'Kontouppgifter',
    'account.email': 'E-post:',
    'account.userId': 'Användar-ID:',
    'account.securityTitle': 'Säkerhet',
    'account.changePassword': 'Byt lösenord',
    'account.deleteAccount': 'Radera konto',
    'account.deleteAccountDisabled': 'Radering är avstängd i denna demo.',
    'account.logout': 'Logga ut',
    'food.loading': 'Laddar produkt...',
    'food.notFoundTitle': 'Produkten hittades inte',
    'food.notFoundBody': 'Vi kunde inte hitta produkten. Försök att skanna igen.',
    'food.backToScanner': 'Tillbaka till skannern',
    'food.details': 'Detaljer',
    'food.alternatives': 'Alternativ',
    'food.noAlternatives': 'Inga alternativ tillgängliga',
    'food.stat.harvested': 'Skördad',
    'food.stat.transport': 'Transport',
    'food.stat.emissions': 'Utsläpp',
    'food.stat.price': 'Pris',
    'food.section.origin': 'Ursprung & Transport',
    'food.section.certifications': 'Certifieringar & kvalitet',
    'food.section.farming': 'Odlingsmetoder',
    'food.section.farmer': 'Bondeberättelse',
    'food.section.recipes': 'Kulturella recept',
    'food.productId': 'ID {id}',
    'start.title': 'VegiTrack',
    'start.tagline': 'Lär känna dina grönsaker',
    'start.description': 'Skanna färska frukter och grönsaker för att utforska Food Passport – ursprung, transport, kvalitet och hållbarhet.',
    'start.selectStore': 'Välj din butik:',
    'start.storePlaceholder': 'Välj en butik...',
    'start.storeSearchPlaceholder': 'Sök butiker...',
    'start.storeEmpty': 'Ingen butik hittades.',
    'start.cta': 'Starta skanning',
    'start.loginRegister': 'Logga in/Registrera',
    'start.signedInAs': 'Inloggad som {email}',
    'start.logout': '(Klicka för att logga ut)',
    'scan.title': 'Skanna en produkt',
    'scan.tip': '🍅 Placera QR-koden i ramen. Skanningen startar automatiskt.',
    'scan.manualTitle': 'Hitta produkt utan QR-kod',
    'scan.placeholder': 'Välj produkt...',
    'scan.searchPlaceholder': 'Sök produkter...',
    'scan.empty': 'Inga produkter hittades.',
    'scan.openButton': 'Öppna vald produkt',
    'scan.loadingButton': 'Öppnar...',
    'scan.invalidQr': 'Ogiltig QR-kod. Försök igen.',
    'scan.openError': 'Kunde inte öppna produkten. Försök igen.',
  },
}

function formatTemplate(template: string, values?: TemplateValues) {
  if (!values) return template
  return template.replace(/\{(.*?)\}/g, (_, key: string) => {
    const value = values[key]
    return value !== undefined ? String(value) : `{${key}}`
  })
}

export function translate(key: TranslationKey, language: LanguageOption, values?: TemplateValues) {
  const dictionary = translations[language] ?? translations['en-US']
  const template = dictionary[key] ?? translations['en-US'][key] ?? key
  return formatTemplate(template, values)
}

export function useTranslation() {
  const { language } = useMenu()
  const t = useMemo(() => (key: TranslationKey, values?: TemplateValues) => translate(key, language, values), [language])
  return { t, language }
}
