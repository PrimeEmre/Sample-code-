/*
 * Created by: yi.zhou and Emre
 * Created on: July 2025
 * This file contains the JS for the main application page (index.html).
 * It manages page logic, user authentication (including Google and MSAL),
 * Wikipedia API searches, and dynamic, self-contained language translation.
 * This expanded version includes detailed comments for improved readability and maintenance.
 */

// Use strict mode to prevent common coding errors and to write "secure" JavaScript.
// This helps catch silent errors and ensures cleaner code.
'use strict';

/**
 * ===================================================================================
 * SECTION 1: GLOBAL CONFIGURATION & STATE MANAGEMENT
 * ===================================================================================
 * This section centralizes all the application's configuration constants and
 * state variables. By keeping them in one place, we make the application
 * easier to manage and update.
 */

// --- API and Client ID Constants ---
// IMPORTANT: These are PUBLIC keys, not secret keys.
// They are required to be in the frontend JavaScript to tell Google and Microsoft
// which application is requesting to log in. Their security comes from configuring
// the "Authorized JavaScript origins" in your Google Cloud and Azure dashboards
// to only allow requests from your website's domain.
const GOOGLE_CLIENT_ID = "1044722351078-tlg7qehp27n6so3ul0r3h07sa9hqujck.apps.googleusercontent.com";
const MSAL_CLIENT_ID = "YOUR_AZURE_CLIENT_ID"; // IMPORTANT: Replace with your actual Azure Client ID.

// --- Application State ---
// This variable tracks the currently selected language for the entire application.
// It defaults to English ('en') when the page first loads.
let currentLanguageCode = 'en';

// --- Local Translation Data ---
// This object contains all UI string translations. Storing them locally in the script
// is much faster than making an API call for every language change.
const allTranslations = {
  "en": { "main_title": "Famous Show Chat", "search_title": "Search for Your Favorite Singer", "search_placeholder": "Enter singer name", "search_button": "Search", "language_button": "Choose a language", "settings_button": "Settings", "theme_button": "Change Theme", "logout_button": "Log Out", "create_character_button": "Create a Character" },
  "es": { "main_title": "Chat de Espectáculos Famosos", "search_title": "Busca a tu cantante favorito", "search_placeholder": "Introduce el nombre del cantante", "search_button": "Buscar", "language_button": "Elige un idioma", "settings_button": "Ajustes", "theme_button": "Cambiar tema", "logout_button": "Cerrar sesión", "create_character_button": "Crear un Personaje" },
  "fr": { "main_title": "Chat de Spectacle Célèbre", "search_title": "Recherchez votre chanteur préféré", "search_placeholder": "Entrez le nom du chanteur", "search_button": "Rechercher", "language_button": "Choisissez une langue", "settings_button": "Paramètres", "theme_button": "Changer de thème", "logout_button": "Se déconnecter", "create_character_button": "Créer un Personnage" },
  "de": { "main_title": "Berühmte Show-Chat", "search_title": "Suchen Sie nach Ihrem Lieblingssänger", "search_placeholder": "Sängernamen eingeben", "search_button": "Suchen", "language_button": "Sprache auswählen", "settings_button": "Einstellungen", "theme_button": "Theme ändern", "logout_button": "Abmelden", "create_character_button": "Charakter Erstellen" },
  "it": { "main_title": "Chat di Spettacoli Famosi", "search_title": "Cerca il tuo cantante preferito", "search_placeholder": "Inserisci il nome del cantante", "search_button": "Cerca", "language_button": "Scegli una lingua", "settings_button": "Impostazioni", "theme_button": "Cambia tema", "logout_button": "Esci", "create_character_button": "Crea un Personaggio" },
  "pt": { "main_title": "Bate-papo de Show Famoso", "search_title": "Procure seu cantor favorito", "search_placeholder": "Digite o nome do cantor", "search_button": "Procurar", "language_button": "Escolha um idioma", "settings_button": "Configurações", "theme_button": "Mudar Tema", "logout_button": "Sair", "create_character_button": "Criar um Personagem" },
  "ru": { "main_title": "Чат о знаменитых шоу", "search_title": "Найдите своего любимого исполнителя", "search_placeholder": "Введите имя исполнителя", "search_button": "Поиск", "language_button": "Выберите язык", "settings_button": "Настройки", "theme_button": "Сменить тему", "logout_button": "Выйти", "create_character_button": "Создать персонажа" },
  "zh": { "main_title": "著名节目聊天", "search_title": "搜索您最喜欢的歌手", "search_placeholder": "输入歌手姓名", "search_button": "搜索", "language_button": "选择语言", "settings_button": "设置", "theme_button": "更换主题", "logout_button": "登出", "create_character_button": "创建角色" },
  "ja": { "main_title": "有名番組チャット", "search_title": "お気に入りの歌手を検索", "search_placeholder": "歌手名を入力", "search_button": "検索", "language_button": "言語を選択", "settings_button": "設定", "theme_button": "テーマを変更", "logout_button": "ログアウト", "create_character_button": "キャラクターを作成" },
  "ko": { "main_title": "유명 쇼 채팅", "search_title": "좋아하는 가수 검색", "search_placeholder": "가수 이름 입력", "search_button": "검색", "language_button": "언어 선택", "settings_button": "설정", "theme_button": "테마 변경", "logout_button": "로그아웃", "create_character_button": "캐릭터 만들기" },
  "ar": { "main_title": "دردشة العروض الشهيرة", "search_title": "ابحث عن مطربك المفضل", "search_placeholder": "أدخل اسم المطرب", "search_button": "بحث", "language_button": "اختر لغة", "settings_button": "الإعدادات", "theme_button": "تغيير السمة", "logout_button": "تسجيل الخروج", "create_character_button": "إنشاء شخصية" },
  "hi": { "main_title": "प्रसिद्ध शो चैट", "search_title": "अपने पसंदीदा गायक को खोजें", "search_placeholder": "गायक का नाम दर्ज करें", "search_button": "खोजें", "language_button": "एक भाषा चुनें", "settings_button": "सेटिंग्स", "theme_button": "थीम बदलें", "logout_button": "लॉग आउट करें", "create_character_button": "किरदार बनाएं" },
  "tr": { "main_title": "Ünlü Şov Sohbeti", "search_title": "Favori Şarkıcınızı Arayın", "search_placeholder": "Şarkıcı adını girin", "search_button": "Ara", "language_button": "Bir dil seçin", "settings_button": "Ayarlar", "theme_button": "Temayı Değiştir", "logout_button": "Oturumu Kapat", "create_character_button": "Karakter Oluştur" },
  "nl": { "main_title": "Beroemde Show Chat", "search_title": "Zoek naar je favoriete zanger", "search_placeholder": "Voer de naam van de zanger in", "search_button": "Zoeken", "language_button": "Kies een taal", "settings_button": "Instellingen", "theme_button": "Thema wijzigen", "logout_button": "Uitloggen", "create_character_button": "Personage Maken" },
  "pl": { "main_title": "Czat o słynnym programie", "search_title": "Wyszukaj swojego ulubionego piosenkarza", "search_placeholder": "Wpisz nazwisko piosenkarza", "search_button": "Szukaj", "language_button": "Wybierz język", "settings_button": "Ustawienia", "theme_button": "Zmień motyw", "logout_button": "Wyloguj się", "create_character_button": "Stwórz Postać" },
  "sv": { "main_title": "Kändisshowchatt", "search_title": "Sök efter din favoritsångare", "search_placeholder": "Ange sångarens namn", "search_button": "Sök", "language_button": "Välj ett språk", "settings_button": "Inställningar", "theme_button": "Ändra tema", "logout_button": "Logga ut", "create_character_button": "Skapa Karaktär" },
  "el": { "main_title": "Συνομιλία διάσημης εκπομπής", "search_title": "Αναζητήστε τον αγαπημένο σας τραγουδιστή", "search_placeholder": "Εισαγάγετε το όνομα του τραγουδιστή", "search_button": "Αναζήτηση", "language_button": "Επιλέξτε μια γλώσσα", "settings_button": "Ρυθμίσεις", "theme_button": "Αλλαγή θέματος", "logout_button": "Αποσύνδεση", "create_character_button": "Δημιουργία Χαρακτήρα" },
  "hu": { "main_title": "Híres Show Chat", "search_title": "Keresse meg kedvenc énekesét", "search_placeholder": "Írja be az énekes nevét", "search_button": "Keresés", "language_button": "Válasszon nyelvet", "settings_button": "Beállítások", "theme_button": "Téma váltása", "logout_button": "Kijelentkezés", "create_character_button": "Karakter Létrehozása" },
  "cs": { "main_title": "Chat slavné show", "search_title": "Vyhledejte svého oblíbeného zpěváka", "search_placeholder": "Zadejte jméno zpěváka", "search_button": "Hledat", "language_button": "Vyberte jazyk", "settings_button": "Nastavení", "theme_button": "Změnit téma", "logout_button": "Odhlásit se", "create_character_button": "Vytvořit Postavu" },
  "da": { "main_title": "Berømt Show Chat", "search_title": "Søg efter din yndlingssanger", "search_placeholder": "Indtast sangerens navn", "search_button": "Søg", "language_button": "Vælg et sprog", "settings_button": "Indstillinger", "theme_button": "Skift tema", "logout_button": "Log ud", "create_character_button": "Opret Karakter" },
  "fi": { "main_title": "Kuuluisan show'n chat", "search_title": "Etsi suosikkilaulajasi", "search_placeholder": "Anna laulajan nimi", "search_button": "Hae", "language_button": "Valitse kieli", "settings_button": "Asetukset", "theme_button": "Vaihda teemaa", "logout_button": "Kirjaudu ulos", "create_character_button": "Luo Hahmo" },
  "ro": { "main_title": "Chat de emisiune faimoasă", "search_title": "Căutați cântărețul preferat", "search_placeholder": "Introduceți numele cântărețului", "search_button": "Căutare", "language_button": "Alegeți o limbă", "settings_button": "Setări", "theme_button": "Schimbă tema", "logout_button": "Deconectare", "create_character_button": "Creează Personaj" },
  "id": { "main_title": "Obrolan Pertunjukan Terkenal", "search_title": "Cari penyanyi favorit Anda", "search_placeholder": "Masukkan nama penyanyi", "search_button": "Cari", "language_button": "Pilih bahasa", "settings_button": "Pengaturan", "theme_button": "Ubah Tema", "logout_button": "Keluar", "create_character_button": "Create a Character" },
  "vi": { "main_title": "Trò chuyện chương trình nổi tiếng", "search_title": "Tìm kiếm ca sĩ yêu thích của bạn", "search_placeholder": "Nhập tên ca sĩ", "search_button": "Tìm kiếm", "language_button": "Chọn một ngôn ngữ", "settings_button": "Cài đặt", "theme_button": "Thay đổi chủ đề", "logout_button": "Đăng xuất", "create_character_button": "Create a Character" },
  "th": { "main_title": "แชทโชว์ดัง", "search_title": "ค้นหานักร้องที่คุณชื่นชอบ", "search_placeholder": "ป้อนชื่อนักร้อง", "search_button": "ค้นหา", "language_button": "เลือกภาษา", "settings_button": "การตั้งค่า", "theme_button": "เปลี่ยนธีม", "logout_button": "ออกจากระบบ", "create_character_button": "Create a Character" },
  "ab": { "main_title": "Ашоу а́ҟазаара чат", "search_title": "И́шәы́ҧшаа шәара ишәы́ҟаз ашәаҳәаҩ", "search_placeholder": "Иа́ҵа́ҩ ашәаҳәаҩ ихьӡ", "search_button": "Аҧшаара", "language_button": "Абызшәа алхра", "settings_button": "Аиҿкаарақәа", "theme_button": "Атема аҧсахра", "logout_button": "Аҭыҵра", "create_character_button": "Create a Character" },
  "aa": { "main_title": "Cusub Show Chat", "search_title": "Raadi Fanaankaaga Jecel", "search_placeholder": "Geli magaca fanaanka", "search_button": "Raadi", "language_button": "Dooro luqad", "settings_button": "Dejinta", "theme_button": "Beddel Mawduuca", "logout_button": "Ka bax", "create_character_button": "Create a Character" },
  "af": { "main_title": "Bekende Skou-klets", "search_title": "Soek vir jou gunsteling sanger", "search_placeholder": "Voer sanger se naam in", "search_button": "Soek", "language_button": "Kies 'n taal", "settings_button": "Instellings", "theme_button": "Verander Tema", "logout_button": "Meld uit", "create_character_button": "Create a Character" },
  "sq": { "main_title": "Bisedë e shfaqjes së famshme", "search_title": "Kërko për këngëtarin tënd të preferuar", "search_placeholder": "Fut emrin e këngëtarit", "search_button": "Kërko", "language_button": "Zgjidh një gjuhë", "settings_button": "Cilësimet", "theme_button": "Ndrysho Temën", "logout_button": "Dil", "create_character_button": "Create a Character" },
  "am": { "main_title": "ታዋቂ ትዕይንት ውይይት", "search_title": "የሚወዱትን ዘፋኝ ይፈልጉ", "search_placeholder": "የዘፋኙን ስም ያስገቡ", "search_button": "ፈልግ", "language_button": "ቋንቋ ይምረጡ", "settings_button": "ቅንብሮች", "theme_button": "ገጽታን ቀይр", "logout_button": "ውጣ", "create_character_button": "Create a Character" },
  "an": { "main_title": "Chat de Espectaclo Famoso", "search_title": "Mirar o tuyo cantaire favorito", "search_placeholder": "Meter o nombre d'o cantaire", "search_button": "Mirar", "language_button": " trigar una luenga", "settings_button": "Achustes", "theme_button": "Cambear de Tema", "logout_button": "Salir", "create_character_button": "Create a Character" },
  "hy": { "main_title": "Հայտնի շոուի զրույց", "search_title": "Որոնեք ձեր սիրած երգչին", "search_placeholder": "Մուտքագրեք երգչի անունը", "search_button": "Որոնել", "language_button": "Ընտրեք լեզու", "settings_button": "Կարգավորումներ", "theme_button": "Փոխել թեման", "logout_button": "Դուրս գալ", "create_character_button": "Create a Character" },
  "as": { "main_title": "বিখ্যাত শ্ব' চেট", "search_title": "আপোনাৰ প্ৰিয় গায়কৰ বাবে সন্ধান কৰক", "search_placeholder": "গায়কৰ নাম দিয়ক", "search_button": "সন্ধान কৰক", "language_button": "এটা भाषा বাছনি কৰক", "settings_button": "ছেটিংছ", "theme_button": "থীম সলনি কৰক", "logout_button": "লগ আউট কৰক", "create_character_button": "Create a Character" },
  "ay": { "main_title": "Uñt'at Espectáculo Chat", "search_title": "Thaqhaña munat q'uchuñaniri", "search_placeholder": "Q'uchuñanirin sutip qillqt'aña", "search_button": "Thaqhaña", "language_button": "Aru ajlliña", "settings_button": "Configuraciones", "theme_button": "Tema mayjt'ayaña", "logout_button": "Mistsuña", "create_character_button": "Create a Character" },
  "az": { "main_title": "Məşhur Şou Söhbəti", "search_title": "Sevimli müğənninizi axtarın", "search_placeholder": "Müğənninin adını daxil edin", "search_button": "Axtar", "language_button": "Bir dil seçin", "settings_button": "Parametrlər", "theme_button": "Mövzunu dəyişdirin", "logout_button": "Çıxış", "create_character_button": "Create a Character" },
  "ba": { "main_title": "Билдәле Шоу Чат", "search_title": "Яратҡан йырсығыҙҙы эҙләгеҙ", "search_placeholder": "Йырсының исемен яҙығыҙ", "search_button": "Эҙләү", "language_button": "Тел һайлағыҙ", "settings_button": "көйләүҙәр", "theme_button": "Теманы үҙгәртеү", "logout_button": "Сығырға", "create_character_button": "Create a Character" },
  "eu": { "main_title": "Ikuskizun Ospetsuaren Txata", "search_title": "Bilatu zure abeslari gogokoena", "search_placeholder": "Sartu abeslariaren izena", "search_button": "Bilatu", "language_button": "Aukeratu hizkuntza bat", "settings_button": "Ezarpenak", "theme_button": "Aldatu gaia", "logout_button": "Saioa amaitu", "create_character_button": "Create a Character" },
  "be": { "main_title": "Чат знакамітага шоу", "search_title": "Знайдзіце свайго любімага спевака", "search_placeholder": "Увядзіце імя спевака", "search_button": "Пошук", "language_button": "Выберыце мову", "settings_button": "Налады", "theme_button": "Змяніць тэму", "logout_button": "Выйсці", "create_character_button": "Create a Character" },
  "bn": { "main_title": "বিখ্যাত শো চ্যাট", "search_title": "আপনার প্রিয় গায়ককে খুঁজুন", "search_placeholder": "গায়কের নাম লিখুন", "search_button": "অনুসন্ধান করুন", "language_button": "একটি ভাষা নির্বাচন করুন", "settings_button": "সেটিংস", "theme_button": "থিম পরিবর্তন করুন", "logout_button": "লগ আউট", "create_character_button": "Create a Character" },
  "dz": { "main_title": "སྙན་གྲགས་ཅན་གྱི་ལྟད་མོ་ཅེཊ།", "search_title": "ཁྱོད་རའི་དགའ་ཤོས་ཀྱི་གཞས་ཚིག་མཁན་འཚོལ།", "search_placeholder": "གཞས་ཚིག་མཁན་གྱི་མིང་བཙུགས།", "search_button": "འཚོལ།", "language_button": "སྐད་ཡིག་ཅིག་གདམ་ཁ་རྐྱབས།", "settings_button": "སྒྲིག་སྟངས།", "theme_button": "བརྗོད་དོན་བསྒྱུར་བཅོས་འབད།", "logout_button": "ཕྱིར་འཐོན།", "create_character_button": "Create a Character" },
  "bi": { "main_title": "Feimas So Sat", "search_title": "Faenem fevorit singa blong yu", "search_placeholder": "Putum nem blong singa", "search_button": "Faenem", "language_button": "Jusum wan langwis", "settings_button": "Seting", "theme_button": "Jenjem Tim", "logout_button": "Log Aot", "create_character_button": "Create a Character" },
  "br": { "main_title": "Chat an Abadenn Brudet", "search_title": "Klaskit ho kaner karetañ", "search_placeholder": "Lakait anv ar c'haner", "search_button": "Klask", "language_button": "Dibabit ur yezh", "settings_button": "Arventennoù", "theme_button": "Cheñch an tem", "logout_button": "Digevreañ", "create_character_button": "Create a Character" },
  "bg": { "main_title": "Чат за известно шоу", "search_title": "Потърсете любимия си певец", "search_placeholder": "Въведете името на певеца", "search_button": "Търсене", "language_button": "Изберете език", "settings_button": "Настройки", "theme_button": "Промяна на темата", "logout_button": "Изход", "create_character_button": "Create a Character" },
  "my": { "main_title": "နာမည်ကြီးရှိုး စကားပြောခန်း", "search_title": "သင်အကြိုက်ဆုံးအဆိုတော်ကို ရှာဖွေပါ", "search_placeholder": "အဆိုတော်အမည်ထည့်ပါ", "search_button": "ရှာဖွေမည်", "language_button": "ဘာသာစကားတစ်ခုရွေးချယ်ပါ", "settings_button": "ဆက်တင်များ", "theme_button": "အပြင်အဆင်ပြောင်းရန်", "logout_button": "ထွက်ရန်", "create_character_button": "Create a Character" },
  "km": { "main_title": "ការជជែកក្នុងកម្មវិធីដ៏ល្បីល្បាញ", "search_title": "ស្វែងរកអ្នកចម្រៀងដែលអ្នកចូលចិត្ត", "search_placeholder": "បញ្ចូលឈ្មោះអ្នកចម្រៀង", "search_button": "ស្វែងរក", "language_button": "ជ្រើសរើសភាសា", "settings_button": "ការកំណត់", "theme_button": "ផ្លាស់ប្តូរស្បែក", "logout_button": "ចាកចេញ", "create_character_button": "Create a Character" },
  "ca": { "main_title": "Xat de l'espectacle famós", "search_title": "Cerca el teu cantant preferit", "search_placeholder": "Introdueix el nom del cantant", "search_button": "Cerca", "language_button": "Tria un idioma", "settings_button": "Configuració", "theme_button": "Canvia el tema", "logout_button": "Tanca la sessió", "create_character_button": "Create a Character" },
  "co": { "main_title": "Chat di u Spettaculu Famosu", "search_title": "Cercate u vostru cantadore preferitu", "search_placeholder": "Intrite u nome di u cantadore", "search_button": "Cerca", "language_button": "Sceglite una lingua", "settings_button": "Impostazioni", "theme_button": "Cambia u tema", "logout_button": "Esce", "create_character_button": "Create a Character" },
  "hr": { "main_title": "Chat poznate emisije", "search_title": "Potražite svog omiljenog pjevača", "search_placeholder": "Unesite ime pjevača", "search_button": "Traži", "language_button": "Odaberite jezik", "settings_button": "Postavke", "theme_button": "Promijeni temu", "logout_button": "Odjava", "create_character_button": "Create a Character" },
  "eo": { "main_title": "Babilejo de Fama Spektaklo", "search_title": "Serĉu vian preferatan kantiston", "search_placeholder": "Enigu la nomon de la kantisto", "search_button": "Serĉi", "language_button": "Elektu lingvon", "settings_button": "Agordoj", "theme_button": "Ŝanĝi Temon", "logout_button": "Elsaluti", "create_character_button": "Create a Character" },
  "et": { "main_title": "Kuulsa saate vestlus", "search_title": "Otsige oma lemmiklauljat", "search_placeholder": "Sisestage laulja nimi", "search_button": "Otsi", "language_button": "Valige keel", "settings_button": "Seaded", "theme_button": "Muuda teemat", "logout_button": "Logi välja", "create_character_button": "Create a Character" },
  "fo": { "main_title": "Kjent Show Kjak", "search_title": "Leita eftir tínum yndissangara", "search_placeholder": "Skriva navn á sangara", "search_button": "Leita", "language_button": "Vel eitt mál", "settings_button": "Stillingar", "theme_button": "Broyt Tema", "logout_button": "Rita út", "create_character_button": "Create a Character" },
  "fj": { "main_title": "Veivosaki ni Ka kilai", "search_title": "Vakasaqarai nomu daulagasere taleitaki", "search_placeholder": "Vola na yaca ni daulagasere", "search_button": "Vakasaqara", "language_button": "Digia e dua na vosa", "settings_button": "iTuvatuva", "theme_button": "Veisautaka na iTuvatuva", "logout_button": "Curucuru", "create_character_button": "Create a Character" },
  "fy": { "main_title": "Ferneamde Show Chat", "search_title": "Sykje nei jo favorite sjonger", "search_placeholder": "Fier de namme fan de sjonger yn", "search_button": "Sykje", "language_button": "Kies in taal", "settings_button": "Ynstellings", "theme_button": "Tema feroarje", "logout_button": "Útlogge", "create_character_button": "Create a Character" },
  "gl": { "main_title": "Chat do espectáculo famoso", "search_title": "Busca o teu cantante favorito", "search_placeholder": "Introduce o nome do cantante", "search_button": "Buscar", "language_button": "Escolle un idioma", "settings_button": "Configuració", "theme_button": "Cambiar tema", "logout_button": "Saír", "create_character_button": "Create a Character" },
  "ka": { "main_title": "ცნობილი შოუს ჩეთი", "search_title": "მოძებნეთ თქვენი საყვარელი მომღერალი", "search_placeholder": "შეიყვანეთ მომღერლის სახელი", "search_button": "ძიება", "language_button": "აირჩიეთ ენა", "settings_button": "პარამეტრები", "theme_button": "თემის შეცვლা", "logout_button": "გასვლა", "create_character_button": "Create a Character" },
  "kl": { "main_title": "Tusarnaartitsineq Tusaamasaq Oqaloqatigiiffik", "search_title": "Erinarsortartoq nuannarisat ujaariuk", "search_placeholder": "Erinarsortartup atia allaguk", "search_button": "Ujaarlerit", "language_button": "Oqaatsit toqqakkit", "settings_button": "Inissiffissat", "theme_button": "Tema allanngortiguk", "logout_button": "Aniffissaq", "create_character_button": "Create a Character" },
  "gn": { "main_title": "Ñomongeta Espectáculo Herakuãitéva", "search_title": "Eheka ne purahéiha rehayhuvéva", "search_placeholder": "Emoinge purahéiha réra", "search_button": "Heka", "language_button": "Eiporavo peteĩ ñe'ẽ", "settings_button": "Mohenda", "theme_button": "Moambue Tema", "logout_button": "Esẽ", "create_character_button": "Create a Character" },
  "gu": { "main_title": "પ્રખ્યાત શો ચેટ", "search_title": "તમારા મનપસંદ ગાયકને શોધો", "search_placeholder": "ગાયકનું નામ દાખલ કરો", "search_button": "શોધો", "language_button": "એક ભાષા પસંદ કરો", "settings_button": "સેટિંગ્સ", "theme_button": "થીમ બદલો", "logout_button": "લૉગ આઉટ કરો", "create_character_button": "Create a Character" },
  "ha": { "main_title": "Shahararren Nunin Hira", "search_title": "Nemo Mawaƙin da kuka fi so", "search_placeholder": "Shigar da sunan mawaƙi", "search_button": "Bincika", "language_button": "Zaɓi yare", "settings_button": "Saituna", "theme_button": "Canja Jigo", "logout_button": "Fita", "create_character_button": "Create a Character" },
  "is": { "main_title": "Frægt þáttaspjall", "search_title": "Leitaðu að uppáhalds söngvaranum þínum", "search_placeholder": "Sláðu inn nafn söngvara", "search_button": "Leita", "language_button": "Veldu tungumál", "settings_button": "Stillingar", "theme_button": "Breyta þema", "logout_button": "Útskrá", "create_character_button": "Create a Character" },
  "ia": { "main_title": "Chat de Spectaculo Famose", "search_title": "Cerca tu cantator favorite", "search_placeholder": "Entra le nomine del cantator", "search_button": "Cercar", "language_button": "Selige un lingua", "settings_button": "Configurationes", "theme_button": "Cambiar thema", "logout_button": "Exir", "create_character_button": "Create a Character" },
  "ie": { "main_title": "Chat de famosi spectacul", "search_title": "Serchar vor preferit cantator", "search_placeholder": "Introducte li nómine del cantator", "search_button": "Serchar", "language_button": "Selecte un lingue", "settings_button": "Configurationes", "theme_button": "Chanje tema", "logout_button": "Surtir", "create_character_button": "Create a Character" },
  "ik": { "main_title": "Iñu-Show Chat", "search_title": "Qiniqsiñiaġikpiñ iḷitqusiġikpiñ", "search_placeholder": "Iñu-atiq aglaguk", "search_button": "Qiniq", "language_button": "Uqautchiq tauqsinaq", "settings_button": "Ilikkułi", "theme_button": "Aglautikun allannguqtin", "logout_button": "Anin", "create_character_button": "Create a Character" },
  "ga": { "main_title": "Comhrá an tSeó Cháiliúil", "search_title": "Cuardaigh an t-amhránaí is fearr leat", "search_placeholder": "Cuir isteach ainm an amhránaí", "search_button": "Cuardaigh", "language_button": "Roghnaigh teanga", "settings_button": "Socruithe", "theme_button": "Athraigh Téama", "logout_button": "Logáil Amach", "create_character_button": "Create a Character" },
  "jv": { "main_title": "Obrolan Pertunjukan Kondhang", "search_title": "Goleki penyanyi favoritmu", "search_placeholder": "Lebokake jeneng penyanyi", "search_button": "Golek", "language_button": "Pilih basa", "settings_button": "Setelan", "theme_button": "Ganti Tema", "logout_button": "Metu", "create_character_button": "Create a Character" },
  "kn": { "main_title": "ಪ್ರಸಿದ್ಧ ಪ್ರದರ್ಶನ ಚಾಟ್", "search_title": "ನಿಮ್ಮ ನೆಚ್ಚಿನ ಗಾಯಕರಿಗಾಗಿ ಹುಡುಕಿ", "search_placeholder": "ಗಾಯಕರ பெயரை ನಮೂದಿಸಿ", "search_button": "ಹುಡುಕಿ", "language_button": "ಒಂದು ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", "settings_button": "ಸಂಯೋಜನೆಗಳು", "theme_button": "ಥೀಮ್ ಬದಲಾಯಿಸಿ", "logout_button": "ಲಾಗ್ ಔਟ", "create_character_button": "Create a Character" },
  "ks": { "main_title": "مشہوٗر شو چیٹ", "search_title": "پنُن پسندیدہ گلوکار ژھانٛڈیو", "search_placeholder": "گلوکار سُنٛد ناو دِیو", "search_button": "ژھانٛڈیو", "language_button": "زَبان ژھانٛڈیو", "settings_button": "ترتیبات", "theme_button": "تھیم بَدلاو", "logout_button": "لاگ آوٹ", "create_character_button": "Create a Character" },
  "kk": { "main_title": "Танымал шоу чаты", "search_title": "Сүйікті әншіңізді іздеңіз", "search_placeholder": "Әншінің атын енгізіңіз", "search_button": "Іздеу", "language_button": "Тілді таңдаңыз", "settings_button": "Параметрлер", "theme_button": "Тақырыпты өзгерту", "logout_button": "Шығу", "create_character_button": "Create a Character" },
  "rw": { "main_title": "Ikiganiro cy'Igitaramo Kizwi", "search_title": "Shakisha umuhanzi ukunda", "search_placeholder": "Andika izina ry'umuhanzi", "search_button": "Shakisha", "language_button": "Hitamo ururimi", "settings_button": "Igenamiterere", "theme_button": "Hindura Insanganyamatsiko", "logout_button": "Sohoka", "create_character_button": "Create a Character" },
  "ky": { "main_title": "Атактуу шоу чаты", "search_title": "Сүйүктүү ырчыңызды издеңиз", "search_placeholder": "Ырчынын атын киргизиңиз", "search_button": "Издөө", "language_button": "Тил тандоо", "settings_button": "Жөндөөлөр", "theme_button": "Теманы өзгөртүү", "logout_button": "Чыгуу", "create_character_button": "Create a Character" },
  "rn": { "main_title": "Ikiganiro c'Igitaramo Kizwi", "search_title": "Rondera umuririmvyi ukunda", "search_placeholder": "Andika izina ry'umuririmvyi", "search_button": "Rondera", "language_button": "Hitamwo ururimi", "settings_button": "Uburyo bwo gukoresha", "theme_button": "Hindura Umutako", "logout_button": "Sohoka", "create_character_button": "Create a Character" },
  "ku": { "main_title": "Gotûbêja Pêşandana Navdar", "search_title": "Li stranbêjê xweya bijare bigerin", "search_placeholder": "Navê stranbêjê binivîse", "search_button": "Lêgerîn", "language_button": "Zimanek hilbijêrin", "settings_button": "Mîhengan", "theme_button": "Mijarê biguherîne", "logout_button": "Derketin", "create_character_button": "Create a Character" },
  "lo": { "main_title": "ສົນທະນາລາຍການດັງ", "search_title": "ຊອກຫານັກຮ້ອງທີ່ທ່ານມັກ", "search_placeholder": "ປ້ອນຊື່ນັກຮ້ອງ", "search_button": "ຊອກຫາ", "language_button": "ເລືอกພາສາ", "settings_button": "ການຕັ້ງຄ່າ", "theme_button": "ປ່ຽນຮູບແບບສີສັນ", "logout_button": "ອອກຈາກລະບົບ", "create_character_button": "Create a Character" },
  "la": { "main_title": "Spectaculi Clari Colloquium", "search_title": "Quaere cantorem tuum dilectum", "search_placeholder": "Nomen cantoris inscribe", "search_button": "Quaere", "language_button": "Linguam elige", "settings_button": "Configurationes", "theme_button": "Thema muta", "logout_button": "Exi", "create_character_button": "Create a Character" },
  "lv": { "main_title": "Slavenā šova tērzēšana", "search_title": "Meklējiet savu iecienītāko dziedātāju", "search_placeholder": "Ievadiet dziedātāja vārdu", "search_button": "Meklēt", "language_button": "Izvēlieties valodu", "settings_button": "Iestatījumi", "theme_button": "Mainīt motīvu", "logout_button": "Iziet", "create_character_button": "Create a Character" },
  "ln": { "main_title": "Lisano lya Etumba Monene", "search_title": "Luka moyembi na yo olingaka", "search_placeholder": "Komá nkómbó ya moyembi", "search_button": "Luka", "language_button": "Pɔnɔ lokótá", "settings_button": "Bobongisi", "theme_button": "Bongola langi", "logout_button": "Bima", "create_character_button": "Create a Character" },
  "lt": { "main_title": "Įžymaus šou pokalbis", "search_title": "Ieškokite savo mėgstamo dainininko", "search_placeholder": "Įveskite dainininko vardą", "search_button": "Ieškoti", "language_button": "Pasirinkite kalbą", "settings_button": "Nustatymai", "theme_button": "Keisti temą", "logout_button": "Atsijungti", "create_character_button": "Create a Character" },
  "mk": { "main_title": "Чет за познато шоу", "search_title": "Пребарајте го вашиот омилен пејач", "search_placeholder": "Внесете го името на пејачот", "search_button": "Пребарај", "language_button": "Изберете јазик", "settings_button": "Поставки", "theme_button": "Промени тема", "logout_button": "Одјави се", "create_character_button": "Create a Character" },
  "mg": { "main_title": "Resadresaky ny Fampisehoana Malaza", "search_title": "Tadiavo ny mpihira tianao indrindra", "search_placeholder": "Ampidiro ny anaran'ny mpihira", "search_button": "Tadiavo", "language_button": "Mifidiana fiteny", "settings_button": "Fandrindrana", "theme_button": "Hanova ny Lohahevitra", "logout_button": "Hivoaka", "create_character_button": "Create a Character" },
  "ms": { "main_title": "Sembang Rancangan Terkenal", "search_title": "Cari penyanyi kegemaran anda", "search_placeholder": "Masukkan nama penyanyi", "search_button": "Cari", "language_button": "Pilih bahasa", "settings_button": "Tetapan", "theme_button": "Tukar Tema", "logout_button": "Log keluar", "create_character_button": "Create a Character" },
  "ml": { "main_title": "പ്രശസ്ത ഷോ ചാറ്റ്", "search_title": "നിങ്ങളുടെ പ്രിയപ്പെട്ട ഗായകനെ തിരയുക", "search_placeholder": "ഗായകന്റെ പേര് നൽകുക", "search_button": "തിരയുക", "language_button": "ഒരു ഭാഷ തിരഞ്ഞെടുക്കുക", "settings_button": "ക്രമീകരണങ്ങൾ", "theme_button": "തീം മാറ്റുക", "logout_button": "ലോഗ് ഔട്ട്", "create_character_button": "Create a Character" },
  "mt": { "main_title": "Chat ta' Show Famuż", "search_title": "Fittex għall-kantant favorit tiegħek", "search_placeholder": "Daħħal l-isem tal-kantant", "search_button": "Fittex", "language_button": "Agħżel lingwa", "settings_button": "Settings", "theme_button": "Biddel it-Tema", "logout_button": "Oħroġ", "create_character_button": "Create a Character" },
  "mi": { "main_title": "Kōrerorero Whakaaturanga Rongonui", "search_title": "Rapua tō kaiwaiata tino pai", "search_placeholder": "Tuhia te ingoa o te kaiwaiata", "search_button": "Rapu", "language_button": "Kōwhiria he reo", "settings_button": "Tautuhinga", "theme_button": "Huria te Kaupapa", "logout_button": "Takiputa", "create_character_button": "Create a Character" },
  "mr": { "main_title": "प्रसिद्ध शो চॅट", "search_title": "आपल्या आवडत्या गायकासाठी शोधा", "search_placeholder": "गायकाचे नाव प्रविष्ट करा", "search_button": "शोधा", "language_button": "एक भाषा निवडा", "settings_button": "सेटिंग्ज", "theme_button": "थीम बदला", "logout_button": "लॉग आउट करा", "create_character_button": "Create a Character" },
  "mo": { "main_title": "Чат де емисиуне фаимоасэ", "search_title": "Кэутаць кынтэрецул преферат", "search_placeholder": "Интродучець нумеле кынтэрецулуй", "search_button": "Кэутаре", "language_button": "Алежець о лимбэ", "settings_button": "Сетэрь", "theme_button": "Скимбэ тема", "logout_button": "Деконектаре", "create_character_button": "Create a Character" },
  "mn": { "main_title": "Алдартай шоу чат", "search_title": "Дуртай дуучнаа хайх", "search_placeholder": "Дуучны нэрийг оруулна уу", "search_button": "Хайх", "language_button": "Хэл сонгоно уу", "settings_button": "Тохиргоо", "theme_button": "Сэдвийг өөрчлөх", "logout_button": "Гарах", "create_character_button": "Create a Character" },
  "na": { "main_title": "Chat Eshow Eibibiten", "search_title": "Eket imin amuneng iyong", "search_placeholder": "Amuge anan imin", "search_button": "Eket", "language_button": "Eiyoe anan", "settings_button": "Eiyoe", "theme_button": "Amuneng Tema", "logout_button": "Eiya", "create_character_button": "Create a Character" },
  "ne": { "main_title": "प्रसिद्ध शो च्याट", "search_title": "आफ्नो मनपर्ने गायक खोज्नुहोस्", "search_placeholder": "गायकको नाम प्रविष्ट गर्नुहोस्", "search_button": "खोज्नुहोस्", "language_button": "एउटा भाषा छान्नुहोस्", "settings_button": "सेटिङहरू", "theme_button": "विषयवस्तु परिवर्तन गर्नुहोस्", "logout_button": "बाहिर निस्कनुहोस्", "create_character_button": "Create a Character" },
  "no": { "main_title": "Kjent Show-prat", "search_title": "Søk etter din favorittsanger", "search_placeholder": "Skriv inn sangernavn", "search_button": "Søk", "language_button": "Velg et språk", "settings_button": "Innstillinger", "theme_button": "Endre tema", "logout_button": "Logg ut", "create_character_button": "Lag Karakter" },
  "oc": { "main_title": "Chat de l'espectacle famós", "search_title": "Cercatz vòstre cantaire preferit", "search_placeholder": "Picatz lo nom del cantaire", "search_button": "Cercar", "language_button": "Causissètz una lenga", "settings_button": "Paramètres", "theme_button": "Cambiar lo tèma", "logout_button": "Se desconnectar", "create_character_button": "Create a Character" },
  "or": { "main_title": "ପ୍ରସିଦ୍ଧ ଶୋ ଚାଟ୍", "search_title": "ଆପଣଙ୍କର ପ୍ରିୟ ଗାୟକ ଖୋଜନ୍ତୁ", "search_placeholder": "ଗାୟକଙ୍କ ନାମ ପ୍ରବେଶ କରନ୍ତୁ", "search_button": "ଖୋଜନ୍ତୁ", "language_button": "ଏକ ଭାଷା ବାଛନ୍ତୁ", "settings_button": "ସେଟିଂସମୂହ", "theme_button": "ଥିମ୍ ବଦଳାନ୍ତୁ", "logout_button": "ଲଗ୍ ଆଉଟ୍ କରନ୍ତୁ", "create_character_button": "Create a Character" },
  "ps": { "main_title": "د مشهور شو چیٹ", "search_title": "خپل د خوښې سندرغاړی وپلټئ", "search_placeholder": "د سندرغاړي نوم دننه کړئ", "search_button": "پلټنه", "language_button": "یوه ژبه غوره کړئ", "settings_button": "ترتیبات", "theme_button": "تیم بدل کړئ", "logout_button": "وتل", "create_character_button": "Create a Character" },
  "fa": { "main_title": "چت شوی معروف", "search_title": "خواننده مورد علاقه خود را جستجو کنید", "search_placeholder": "نام خواننده را وارد کنید", "search_button": "جستجو", "language_button": "یک زبان را انتخاب کنید", "settings_button": "تنظیمات", "theme_button": "تغییر تم", "logout_button": "خروج", "create_character_button": "Create a Character" },
  "pa": { "main_title": "ਮਸ਼ਹੂਰ ਸ਼ੋਅ ਚੈਟ", "search_title": "ਆਪਣੇ ਮਨਪਸੰਦ ਗਾਇਕ ਦੀ ਖੋਜ ਕਰੋ", "search_placeholder": "ਗਾਇਕ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ", "search_button": "ਖੋਜ", "language_button": "ਇੱਕ ਭਾਸ਼ਾ ਚੁਣੋ", "settings_button": "ਸੈਟਿੰਗਾਂ", "theme_button": "ਥੀਮ ਬਦਲੋ", "logout_button": "ਲਾੱਗ ਆਊਟ", "create_character_button": "Create a Character" },
  "qu": { "main_title": "Riqsisqa Espectáculo Rimay", "search_title": "Maskhay munakusqayki takiqta", "search_placeholder": "Takiqpa sutinta qillqay", "search_button": "Maskhay", "language_button": "Simi akllay", "settings_button": "Kamachinakuna", "theme_button": "Llimp'ita t'ikray", "logout_button": "Lluqsiy", "create_character_button": "Create a Character" },
  "sm": { "main_title": "Talatalanoaga o le Fa'aaliga Ta'uta'ua", "search_title": "Su'e lau pese pese e te fiafia iai", "search_placeholder": "Fa'aigoa le igoa o le pese pese", "search_button": "Su'e", "language_button": "Filifili se gagana", "settings_button": "Fa'atonuga", "theme_button": "Suia le Autu", "logout_button": "Alu ese", "create_character_button": "Create a Character" },
  "sg": { "main_title": "Chat ti Show so A-sake", "search_title": "Gi so mo-kwa ti mo so a-ye", "search_placeholder": "Tìa-ndáa ní ti mo-kwa", "search_button": "Gi", "language_button": "Fà-nda ní", "settings_button": "Sárá-gbánda", "theme_button": "Sànzàa Tema", "logout_button": "Fùnà", "create_character_button": "Create a Character" },
  "sa": { "main_title": "प्रसिद्धप्रदर्शनसंलापः", "search_title": "भवतः प्रियं गायकं अन्विष्यतु", "search_placeholder": "गायकस्य नाम लिखतु", "search_button": "अन्विष्यतु", "language_button": "भाषां चिनोतु", "settings_button": "विन्यासाः", "theme_button": "विषयं परिवर्तयतु", "logout_button": "निर्गच्छतु", "create_character_button": "Create a Character" },
  "gd": { "main_title": "Còmhradh an Taisbeanaidh Ainmeil", "search_title": "Lorg an seinneadair as fheàrr leat", "search_placeholder": "Cuir a-steach ainm an t-seinneadair", "search_button": "Lorg", "language_button": "Tagh cànan", "settings_button": "Roghainnean", "theme_button": "Atharraich an Cuspair", "logout_button": "Clàraich a-mach", "create_character_button": "Create a Character" },
  "sr": { "main_title": "Чет познате емисије", "search_title": "Потражите свог омиљеног певача", "search_placeholder": "Унесите име певача", "search_button": "Тражи", "language_button": "Изаберите језик", "settings_button": "Подешавања", "theme_button": "Промени тему", "logout_button": "Одјави се", "create_character_button": "Create a Character" },
  "sh": { "main_title": "Čet poznate emisije", "search_title": "Potražite svog omiljenog pjevača", "search_placeholder": "Unesite ime pjevača", "search_button": "Traži", "language_button": "Odaberite jezik", "settings_button": "Postavke", "theme_button": "Promijeni temu", "logout_button": "Odjava", "create_character_button": "Create a Character" },
  "st": { "main_title": "Puisano ea Pontšo e Tsebahalang", "search_title": "Batla sebini seo u se ratang", "search_placeholder": "Kenya lebitso la sebini", "search_button": "Batla", "language_button": "Khetha puo", "settings_button": "Litlhophiso", "theme_button": "Fetola Sehlooho", "logout_button": "Tsoa", "create_character_button": "Create a Character" },
  "tn": { "main_title": "Puisano ya Theko e e Itsegeng", "search_title": "Batla moopedi yo o mo ratang", "search_placeholder": "Kwala leina la moopedi", "search_button": "Batla", "language_button": "Tlhopha puo", "settings_button": "Dithulaganyo", "theme_button": "Fetola Mmala", "logout_button": "Tswala", "create_character_button": "Create a Character" },
  "sn": { "main_title": "Chat yeShow Inozivikanwa", "search_title": "Tsvaga muimbi wako waunofarira", "search_placeholder": "Isa zita remuimbi", "search_button": "Tsvaga", "language_button": "Sarudza mutauro", "settings_button": "Zvirongwa", "theme_button": "Chinja Dingindira", "logout_button": "Buda", "create_character_button": "Create a Character" },
  "sd": { "main_title": "مشهور شو چيٽ", "search_title": "پنهنجي پسنديده ڳائڻي کي ڳوليو", "search_placeholder": "ڳائڻي جو نالو داخل ڪريو", "search_button": "ڳوليو", "language_button": "هڪ ٻولي چونڊيو", "settings_button": "سيٽਿੰਗون", "theme_button": "موضوع تبديل ڪريو", "logout_button": "ਲਾگ آئوٽ", "create_character_button": "Create a Character" },
  "si": { "main_title": "ප්‍රසිද්ධ දර්ශන කතාබස්", "search_title": "ඔබේ ප්‍රියතම ගායකයා සොයන්න", "search_placeholder": "ගායකයාගේ නම ඇතුළත් කරන්න", "search_button": "සොයන්න", "language_button": "භාෂාවක් තෝරන්න", "settings_button": "සැකසුම්", "theme_button": "තේමාව වෙනස් කරන්න", "logout_button": "ਲොగ్ අවුට්", "create_character_button": "Create a Character" },
  "ss": { "main_title": "Ingcoco yembukiso ledvumile", "search_title": "Funa umculi wakho lomtsandzako", "search_placeholder": "Faka ligama lemculi", "search_button": "Funa", "language_button": "Khetha lulwimi", "settings_button": "Tinhlelo", "theme_button": "Shintja Siboneelo", "logout_button": "Phuma", "create_character_button": "Create a Character" },
  "sk": { "main_title": "Chat slávnej šou", "search_title": "Vyhľadajte svojho obľúbeného speváka", "search_placeholder": "Zadajte meno speváka", "search_button": "Hľadať", "language_button": "Vyberte jazyk", "settings_button": "Nastavenia", "theme_button": "Zmeniť tému", "logout_button": "Odhlásiť sa", "create_character_button": "Create a Character" },
  "sl": { "main_title": "Klepet znane oddaje", "search_title": "Poiščite svojega najljubšega pevca", "search_placeholder": "Vnesite ime pevca", "search_button": "Išči", "language_button": "Izberite jezik", "settings_button": "Nastavitve", "theme_button": "Spremeni temo", "logout_button": "Odjava", "create_character_button": "Create a Character" },
  "so": { "main_title": "Wadahadalka Bandhigga Caanka ah", "search_title": "Raadi fannaanka aad jeceshahay", "search_placeholder": "Geli magaca fannaanka", "search_button": "Raadi", "language_button": "Dooro luqad", "settings_button": "Dejinta", "theme_button": "Beddel Mawduuca", "logout_button": "Ka bax", "create_character_button": "Create a Character" },
  "su": { "main_title": "Obrolan Pintonan Kasohor", "search_title": "Téangan penyanyi karesep anjeun", "search_placeholder": "Asupkeun nami penyanyi", "search_button": "Téang", "language_button": "Pilih basa", "settings_button": "Setélan", "theme_button": "Ganti Téma", "logout_button": "Kaluar", "create_character_button": "Create a Character" },
  "sw": { "main_title": "Soga la Kipindi Maarufu", "search_title": "Tafuta mwimbaji umpendaye", "search_placeholder": "Weka jina la mwimbaji", "search_button": "Tafuta", "language_button": "Chagua lugha", "settings_button": "Mipangilio", "theme_button": "Badilisha Mandhari", "logout_button": "Ondoka", "create_character_button": "Create a Character" },
  "tl": { "main_title": "Sikat na Palabas na Chat", "search_title": "Hanapin ang iyong paboritong mang-aawit", "search_placeholder": "Ilagay ang pangalan ng mang-aawit", "search_button": "Maghanap", "language_button": "Pumili ng isang wika", "settings_button": "Mga Setting", "theme_button": "Baguhin ang Tema", "logout_button": "Mag-log Out", "create_character_button": "Create a Character" },
  "tg": { "main_title": "Чати намоиши машҳур", "search_title": "Сарояндаи дӯстдоштаи худро ҷустуҷӯ кунед", "search_placeholder": "Номи сарояндаро ворид кунед", "search_button": "Ҷустуҷӯ", "language_button": "Забонро интихоб кунед", "settings_button": "Танзимот", "theme_button": "Тағйири мавзӯъ", "logout_button": "Баромадан", "create_character_button": "Create a Character" },
  "ta": { "main_title": "பிரபலமான நிகழ்ச்சி அரட்டை", "search_title": "உங்களுக்குப் பிடித்த பாடகரைத் தேடுங்கள்", "search_placeholder": "பாடகரின் பெயரை உள்ளிடவும்", "search_button": "தேடு", "language_button": "ஒரு மொழியைத் தேர்ந்தெடுக்கவும்", "settings_button": "அமைப்புகள்", "theme_button": "தீம் மாற்றவும்", "logout_button": "வெளியேறு", "create_character_button": "Create a Character" },
  "tt": { "main_title": "Танылган тамаша чаты", "search_title": "Яраткан җырчыгызны эзләгез", "search_placeholder": "Җырчы исемен кертегез", "search_button": "Эзләү", "language_button": "Тел сайлагыз", "settings_button": "Көйләүләр", "theme_button": "Теманы үзгәртү", "logout_button": "Чыгу", "create_character_button": "Create a Character" },
  "te": { "main_title": "ప్రసిద్ధ ప్రదర్శన చాట్", "search_title": "మీకు ఇష్టమైన గాయకుడి కోసం శోధించండి", "search_placeholder": "గాయకుడి పేరును నమోదు చేయండి", "search_button": "శోధించు", "language_button": "ఒక భాషను ఎంచుకోండి", "settings_button": "సెట్టింగ్‌లు", "theme_button": "థీమ్‌ను మార్చండి", "logout_button": "లాగ్ అవుట్", "create_character_button": "Create a Character" },
  "bo": { "main_title": "མིང་གྲགས་ཅན་གྱི་ལྟད་མོ་ཅེཊ།", "search_title": "ཁྱེད་ཀྱི་དགའ་ཤོས་ཀྱི་གཞས་པ་འཚོལ།", "search_placeholder": "གཞས་པའི་མིང་བཙུགས།", "search_button": "འཚོལ།", "language_button": "སྐད་ཡིག་ཅིག་གདམ་ཁ་རྐྱབས།", "settings_button": "སྒྲིག་སྟངས།", "theme_button": "བརྗོད་དོན་བསྒྱུར་བཅོས་འབད།", "logout_button": "ཕྱིར་འཐོན།", "create_character_button": "Create a Character" },
  "ti": { "main_title": "ናይ ህቡብ ምርኢት ምዝርራብ", "search_title": "ነቲ እትፈትዎ ደራፋይ ድለ", "search_placeholder": "ስም ደራፋይ የእትው", "search_button": "ድለ", "language_button": "ቋንቋ ምረጽ", "settings_button": "ቅጥዕታት", "theme_button": "ቴማ ቀይர்", "logout_button": "ውጻእ", "create_character_button": "Create a Character" },
  "to": { "main_title": "Talanoa 'o e Polokalama 'Iloa", "search_title": "Kumi ho'o taha hiva manakoa", "search_placeholder": "Fakahuu e hingoa 'o e taha hiva", "search_button": "Kumi", "language_button": "Fili ha lea", "settings_button": "Ngaahi Fokotu'utu'u", "theme_button": "Liliu e Kaveinga", "logout_button": "Hu ki tu'a", "create_character_button": "Create a Character" },
  "ts": { "main_title": "Bulo bya Nkombiso lowu Dumeke", "search_title": "Lava muyimbeleri la rhandzekaka wa wena", "search_placeholder": "Nghenisa vito ra muyimbeleri", "search_button": "Lava", "language_button": "Hlawula ririmi", "settings_button": "Swiletelo", "theme_button": "Cinca Theme", "logout_button": "Pfula", "create_character_button": "Create a Character" },
  "tk": { "main_title": "Meşhur tomaşa söhbeti", "search_title": "Halan aýdymçyňyzy gözläň", "search_placeholder": "Aýdymçynyň adyny giriziň", "search_button": "Gözleg", "language_button": "Dil saýlaň", "settings_button": "Sazlamalar", "theme_button": "Temany üýtgetmek", "logout_button": "Çykmak", "create_character_button": "Create a Character" },
  "tw": { "main_title": "Kasa a Anigyeɛ Dwumadi a ɛyɛ Dɛ", "search_title": "Hwehwɛ wo odwontofo a wopɛ no", "search_placeholder": "Kyerɛw odwontofo no din", "search_button": "Hwehwɛ", "language_button": "Yi kasa bi", "settings_button": "Nsiesieɛ", "theme_button": "Sesa Tɛma", "logout_button": "Pue", "create_character_button": "Create a Character" },
  "ug": { "main_title": "مەشھۇر كۆرگەزمە پاراڭلىشىش", "search_title": "ياقتۇرىدىغان ناخشىچىڭىزنى ئىزدەڭ", "search_placeholder": "ناخشىچىنىڭ ئىسمىنى كىرگۈزۈڭ", "search_button": "ئىزدەش", "language_button": "بىر تىل تاللاڭ", "settings_button": "تەڭشەكلەر", "theme_button": "باش تېმىنى ئۆزگەرتىش", "logout_button": "چېكىنىش", "create_character_button": "Create a Character" },
  "uk": { "main_title": "Чат відомого шоу", "search_title": "Знайдіть свого улюбленого співака", "search_placeholder": "Введіть ім'я співака", "search_button": "Пошук", "language_button": "Виберіть мову", "settings_button": "Налаштування", "theme_button": "Змінити тему", "logout_button": "Вийти", "create_character_button": "Створити Персонажа" },
  "ur": { "main_title": "مشہور شو چیٹ", "search_title": "اپنے پسندیدہ گلوکار کو تلاش کریں", "search_placeholder": "گلوکار کا نام درج کریں", "search_button": "تلاش کریں", "language_button": "ایک زبان منتخب کریں", "settings_button": "ترتیبات", "theme_button": "تھیم تبدیل کریں", "logout_button": "لاگ آؤٹ", "create_character_button": "Create a Character" },
  "uz": { "main_title": "Mashhur shou suhbati", "search_title": "Sevimli qo'shiqchingizni qidiring", "search_placeholder": "Qo'shiqchi nomini kiriting", "search_button": "Qidirish", "language_button": "Tilni tanlang", "settings_button": "Sozlamalar", "theme_button": "Mavzuni o'zgartirish", "logout_button": "Chiqish", "create_character_button": "Create a Character" },
  "vo": { "main_title": "Cat de jow famik", "search_title": "Sukön kanitan pübikün", "search_placeholder": "Penön nemi kanitana", "search_button": "Sukön", "language_button": "Välön püki", "settings_button": "Paramets", "theme_button": "Votükön timi", "logout_button": "Senön", "create_character_button": "Create a Character" },
  "cy": { "main_title": "Sgwrs y Sioe Enwog", "search_title": "Chwiliwch am eich hoff ganwr", "search_placeholder": "Rhowch enw'r canwr", "search_button": "Chwilio", "language_button": "Dewiswch iaith", "settings_button": "Gosodiadau", "theme_button": "Newid Thema", "logout_button": "Allgofnodi", "create_character_button": "Create a Character" },
  "wo": { "main_title": "Waxtaanu Show bu Siwe", "search_title": "Seetal sa woykat bu màgg", "search_placeholder": "Bindal turu woykat bi", "search_button": "Seet", "language_button": "Tànnal ab làmmiñ", "settings_button": "Paramètres", "theme_button": "Soppi Téma", "logout_button": "Génn", "create_character_button": "Create a Character" },
  "xh": { "main_title": "Ingxoxo yoMboniso oDumiweyo", "search_title": "Khangela imvumi oyithandayo", "search_placeholder": "Faka igama lemvumi", "search_button": "Khangela", "language_button": "Khetha ulwimi", "settings_button": "Iisetingi", "theme_button": "Tshintsha Umxholo", "logout_button": "Phuma", "create_character_button": "Create a Character" },
  "yi": { "main_title": "באַרימט ווייַזן שמועס", "search_title": "זוכן פֿאַר דיין באַליבסטע זינגער", "search_placeholder": "אַרייַן די נאָמען פון די זינגער", "search_button": "זוכן", "language_button": "קלייַבן אַ שפּראַך", "settings_button": "סעטטינגס", "theme_button": "טויшן טעמע", "logout_button": "קלאָץ אויס", "create_character_button": "Create a Character" },
  "yo": { "main_title": "Obrolan Ifihan Olokiki", "search_title": "Wa akọrin ayanfẹ rẹ", "search_placeholder": "Tẹ orukọ akọrin sii", "search_button": "Wa", "language_button": "Yan ede kan", "settings_button": "Ètò", "theme_button": "Yi Akori pada", "logout_button": "Jade", "create_character_button": "Create a Character" },
  "zu": { "main_title": "Ingxoxo yoMbukiso oDumile", "search_title": "Sesha umculi wakho omthandayo", "search_placeholder": "Faka igama lomculi", "search_button": "Sesha", "language_button": "Khetha ulimi", "settings_button": "Izilungiselelo", "theme_button": "Shintsha Itimu", "logout_button": "Phuma", "create_character_button": "Create a Character" }
};

/**
 * ===================================================================================
 * SECTION 2: UTILITY FUNCTIONS
 * ===================================================================================
 * This section contains helper functions that perform common tasks throughout the
 * application, such as displaying messages or interacting with the Wikipedia API.
 */

/**
 * Displays a dismissible UI message to the user using a Bootstrap alert.
 * This function creates a temporary alert element and appends it to a target container.
 * @param {string} message The message content to display to the user.
 * @param {string} [type='info'] The Bootstrap alert type (e.g., 'success', 'danger', 'warning').
 * @param {string} [targetElementId='searchResults'] The ID of the HTML element where the message should be displayed.
 */
function showUIMessage(message, type = 'info', targetElementId = 'searchResults') {
    // Find the container element where the message will be placed.
    let targetElement = document.getElementById(targetElementId) || document.getElementById('profileinfo');
    
    // If no target is found, fall back to a simple browser alert.
    if (!targetElement) {
        console.warn(`UI Message Target element with ID '${targetElementId}' not found. Falling back to standard alert.`);
        alert(message);
        return;
    }

    // Create the main alert `div` element.
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    messageDiv.setAttribute('role', 'alert');

    // Set the inner HTML of the alert, including the message and a close button.
    messageDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    
    // Clear any previous messages in the target element and append the new one.
    targetElement.innerHTML = '';
    targetElement.appendChild(messageDiv);

    // Automatically close the alert after 5 seconds for a better user experience.
    setTimeout(() => {
        if (messageDiv.parentElement) {
            const bsAlert = new bootstrap.Alert(messageDiv);
            if (bsAlert) {
                bsAlert.close();
            }
        }
    }, 5000);
}


/**
 * ===================================================================================
 * SECTION 3: WIKIPEDIA API FUNCTIONS
 * ===================================================================================
 * These functions handle all interactions with the public Wikipedia API.
 */

/**
 * Fetches a spelling suggestion or the most relevant search result from Wikipedia.
 * @param {string} query The user's search term.
 * @param {string} langCode The two-letter language code for the Wikipedia version (e.g., 'en', 'tr').
 * @returns {Promise<string|null>} A promise that resolves with the best matching page title, or null if no results are found.
 */
async function getWikipediaSuggestion(query, langCode) {
    console.log(`Getting Wikipedia suggestion for "${query}" on '${langCode}.wikipedia.org'`);
    const apiUrl = `https://${langCode}.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Return the title of the first search result, or null if the search array is empty.
        return data.query.search.length > 0 ? data.query.search[0].title : null;
    } catch (error) {
        console.error(`Error fetching Wikipedia suggestion for language '${langCode}':`, error);
        return null;
    }
}

/**
 * Fetches the introductory summary and thumbnail image for a specific Wikipedia article.
 * @param {string} title The exact title of the Wikipedia article to fetch.
 * @param {string} langCode The two-letter language code for the Wikipedia version.
 * @returns {Promise<object|null>} A promise that resolves with an object containing the article info, or null on failure.
 */
async function getWikipediaArticleInfo(title, langCode) {
    console.log(`Getting Wikipedia article for "${title}" on '${langCode}.wikipedia.org'`);
    const apiUrl = `https://${langCode}.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(title)}&prop=extracts|pageimages&exsentences=50&explaintext&pithumbsize=300`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const pageId = Object.keys(data.query.pages)[0];
        
        // A pageId of "-1" means the article does not exist.
        if (pageId === "-1") {
            return null;
        }

        const page = data.query.pages[pageId];
        // Construct a clean object with the data we need.
        return {
            title: page.title,
            extract: page.extract,
            imageUrl: page.thumbnail ? page.thumbnail.source : null
        };
    } catch (error) {
        console.error(`Error fetching Wikipedia article for language '${langCode}':`, error);
        return null;
    }
}


/**
 * ===================================================================================
 * SECTION 4: CORE APPLICATION LOGIC & EVENT HANDLERS
 * ===================================================================================
 * This section contains the main logic that drives the user interface, such as
 * handling language changes and search form submissions.
 */

/**
 * Orchestrates language selection by translating the UI.
 * This corrected version ensures a consistent and reliable experience for all languages.
 * @param {Event} event The click event from the language dropdown.
 */
async function handleLanguageSelection(event) {
    // Prevent the default link behavior.
    event.preventDefault();

    // Find the specific language link that was clicked.
    const selectedLanguageItem = event.target.closest('a.dropdown-item');
    if (!selectedLanguageItem) {
        return; // Exit if the click wasn't on a language item.
    }

    // Get the language code and name from the data attributes.
    const langCode = selectedLanguageItem.dataset.langCode;
    const langName = selectedLanguageItem.dataset.langName || selectedLanguageItem.textContent;

    // Validate that the language item is properly configured.
    if (!langCode) {
        showUIMessage(`The language '${langName}' is not fully configured.`, 'warning');
        return;
    }

    // 1. Update the application's current language state.
    currentLanguageCode = langCode;
    // Persist it — without this, navigating to any other page (like Create a
    // Character) silently reset the UI language back to English, because
    // currentLanguageCode only ever lived in this one page's memory.
    localStorage.setItem('ibochat_ui_lang', langCode);

    // 2. Find the correct set of translations from our local object.
    const translatedTexts = allTranslations[langCode];

    // 3. If translations exist, update every element on the page.
    if (translatedTexts) {
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translatedTexts[key]) {
                if (el.placeholder) {
                    el.placeholder = translatedTexts[key];
                } else {
                    const icon = el.querySelector('i');
                    const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
                    if (textNode) {
                        textNode.textContent = ` ${translatedTexts[key]}`;
                    } else { 
                        el.textContent = translatedTexts[key];
                        if (icon) el.prepend(icon, ' ');
                    }
                }
            }
        });
        
        // 4. Show a standard success message. This now happens for ALL languages.
        showUIMessage(`The UI has been translated to ${langName}.`, 'success');

    } else {
        // This will run if a language is in the HTML but not in our translation object.
        showUIMessage(`Translation is not available for ${langName}.`, 'danger');
    }
}


/**
 * Manages searching Wikipedia in the correct language and rendering the results.
 * @param {string} query The search term entered by the user.
 * @param {string} langCode The language code for the search.
 */
async function handleWikipediaSearch(query, langCode) {
    const searchResultsDiv = document.getElementById('searchResults');
    if (!query) {
        showUIMessage("Please provide a search term.", 'warning');
        return;
    }

    const effectiveLangCode = langCode || currentLanguageCode || 'en';
    console.log(`Executing Wikipedia search for "${query}" with language code: ${effectiveLangCode}`);

    // Show a loading spinner while the search is in progress.
    if (!searchResultsDiv.querySelector('.spinner-border')) {
        searchResultsDiv.innerHTML = `<div class="text-center"><div class="spinner-border" role="status"></div><p class="mt-2">Searching for "${query}"...</p></div>`;
    }

    // First, get a suggested title to handle misspellings.
    const suggestedTitle = await getWikipediaSuggestion(query, effectiveLangCode);

    // If a suggestion is found, fetch the full article info.
    if (suggestedTitle) {
        const articleInfo = await getWikipediaArticleInfo(suggestedTitle, effectiveLangCode);
        if (articleInfo) {
            // detectGender relies on English pronouns (he/she). For non-English
            // Wikipedia pages the extract has no gendered pronouns, so we fetch
            // the English article solely for gender detection.
            let gender = 'male';
            if (effectiveLangCode === 'en') {
                gender = detectGender(articleInfo.extract);
            } else {
                const enTitle = await getWikipediaSuggestion(suggestedTitle, 'en');
                if (enTitle) {
                    const enInfo = await getWikipediaArticleInfo(enTitle, 'en');
                    if (enInfo) gender = detectGender(enInfo.extract);
                }
            }
            renderWikipediaArticle(articleInfo, effectiveLangCode, gender, query);
        } else {
            showUIMessage(`Could not retrieve details for "${suggestedTitle}" on ${effectiveLangCode.toUpperCase()} Wikipedia.`, 'danger');
        }
    } else {
        showUIMessage(`Sorry, no results found for "${query}" on ${effectiveLangCode.toUpperCase()} Wikipedia.`, 'danger');
    }
}

/**
/**
 * Detects gender from a Wikipedia extract by counting gendered pronouns.
 */
function detectGender(extract) {
    if (!extract) return 'male';
    const text = extract.toLowerCase();
    const maleCount   = (text.match(/\b(he|his|him)\b/g) || []).length;
    const femaleCount = (text.match(/\b(she|her|hers)\b/g) || []).length;
    return femaleCount > maleCount ? 'female' : 'male';
}

/**
 * Renders the fetched Wikipedia article into the search results area.
 * @param {object} articleInfo The article data object from getWikipediaArticleInfo.
 * @param {string} langCode The language code used for the search, to build the correct link.
 */
function renderWikipediaArticle(articleInfo, langCode, gender, originalQuery) {
    const searchResultsDiv = document.getElementById('searchResults');
    const imageHtml = articleInfo.imageUrl ? `<img src="${articleInfo.imageUrl}" class="img-fluid rounded float-start me-3 mb-2" alt="${articleInfo.title}" style="max-width: 120px;">` : '';

    // Wikipedia resolves a search like "Cübbeli Ahmet Hoca" (his commonly
    // known name) to the article's canonical title ("Ahmet Mahmut Ünlü",
    // his legal name) via a redirect — articleInfo.title is always that
    // resolved canonical form. Using it for the chat itself meant the app
    // silently swapped in a different name than the one actually searched
    // for. Chat with the name the user typed instead; the heading above
    // still shows Wikipedia's official title for context, so nothing about
    // who this actually resolved to is hidden, just not force-used for chat.
    const chatName = (originalQuery && originalQuery.trim()) || articleInfo.title;

    const infoHtml = `
        <h3>${articleInfo.title}</h3>
        <div>${imageHtml}<p>${articleInfo.extract || "No summary available."}</p></div>
        <a href="chat.html?person=${encodeURIComponent(chatName)}&lang=${langCode}&gender=${gender}" target="_blank" class="btn btn-primary">
            <i class="fa-solid fa-comment me-2"></i>Speak to ${chatName}
        </a>`;

    searchResultsDiv.innerHTML = infoHtml;
}


/**
 * Filters the language dropdown list based on user input in the search box.
 */
function filterLanguageDropdown() {
    const searchInput = document.getElementById('languageSearchInput');
    const filterText = searchInput.value.toLowerCase();
    const dropdownMenu = searchInput.closest('.dropdown-menu');
    const languageItems = dropdownMenu.querySelectorAll('li a.dropdown-item');
    
    // Loop through each language item and hide/show it based on the filter text.
    languageItems.forEach(item => {
        const matches = item.textContent.toLowerCase().includes(filterText);
        item.parentElement.style.display = matches ? '' : 'none';
    });
}


/**
 * ===================================================================================
 * SECTION 5: AUTHENTICATION & ROUTING
 * ===================================================================================
 * This section handles all user authentication logic, including login success,
 * logout, and responses from third-party providers like Google and Microsoft.
 */

/**
 * Handles successful login by storing user data and redirecting.
 * @param {string} type - The type of login (e.g., 'google', 'microsoft', 'email').
 * @param {string} identifier - The user's email or name.
 */
function handleLoginSuccess(type, identifier) {
    localStorage.setItem('loggedInUserType', type);
    localStorage.setItem('loggedInUserIdentifier', identifier);
    window.location.href = 'index.html';
}

/**
 * Handles user logout by clearing storage and redirecting.
 */
function handleLogout() {
    const authType = localStorage.getItem('loggedInUserType');
    localStorage.clear();
    
    // Special handling for MSAL to ensure proper session termination.
    if (authType === 'microsoft' && typeof msalInstance !== 'undefined' && msalInstance) {
        msalInstance.logoutRedirect({ postLogoutRedirectUri: window.location.origin }).catch(err => {
            console.error("MSAL Logout Error:", err);
            window.location.href = 'login.html';
        });
    } else {
        window.location.href = 'login.html';
    }
}

/**
 * Callback function for a successful Google Sign-In.
 * @param {object} response - The credential response from Google.
 */
function handleGoogleCredentialResponse(response) {
    try {
        // Decode the JWT to get user information.
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        handleLoginSuccess('google', payload.email || payload.name);
    } catch (error) {
        showUIMessage("Google login failed during token processing.", 'danger', 'profileinfo');
    }
}

/**
 * Callback function for a successful Microsoft Sign-In.
 * @param {object} response - The response object from MSAL.
 */
function handleMicrosoftLoginResponse(response) {
    if (response && response.account) {
        handleLoginSuccess('microsoft', response.account.username || response.account.name);
    }
}


/**
 * ===================================================================================
 * SECTION 6: PAGE INITIALIZATION & EVENT LISTENERS
 * ===================================================================================
 * This is the main entry point for the script. It determines which page is currently
 * loaded and calls the appropriate setup function.
 */
document.addEventListener('DOMContentLoaded', () => {
    // This corrected logic checks which page is loaded and runs the correct setup function.
    if (document.body.classList.contains('ibo-chat')) {
        // If it's the main chat page (which has the class 'ibo-chat' on the body), run this.
        initializeChatPage();
    } else {
        // Otherwise, assume it's the login page and run the login setup.
        initializeLoginPage();
    }
});

/**
 * Sets up all event listeners and initial state for the main chat page (index.html).
 */
function initializeChatPage() {
    // Select all necessary elements from the DOM.
    const settingsLogoutBtn = document.getElementById('logoutBtn');
    const loggedInUserSpan = document.getElementById('logged-in-user');
    const themeToggleButton = document.getElementById('btn-toggle');
    const searchForm = document.getElementById('searchForm');
    const languageDropdown = document.querySelector('[aria-labelledby="languageDropdownButton"]');
    const languageSearchInput = document.getElementById('languageSearchInput');

    // Check if a user is logged in. If not, redirect to the login page.
    const loggedInUserIdentifier = localStorage.getItem('loggedInUserIdentifier');
    if (!loggedInUserIdentifier) {
        window.location.href = 'login.html';
        return; // Stop running the rest of the function.
    }

    // Display the logged-in user's identifier in the navbar.
    if (loggedInUserSpan) {
        loggedInUserSpan.textContent = `Logged in as: ${loggedInUserIdentifier}`;
    }
    
    // Attach event listener for the logout button.
    if (settingsLogoutBtn) {
        settingsLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // Attach event listener for the theme toggle button.
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }
    
    // Attach event listener for the main search form submission.
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchInput = document.getElementById('search');
            handleWikipediaSearch(searchInput.value, currentLanguageCode);
        });
    }
    
    // Attach event listener for the language selection dropdown.
    if (languageDropdown) {
        languageDropdown.addEventListener('click', handleLanguageSelection);
    }
    
    // Attach event listeners for the language search input field.
    if (languageSearchInput) {
        languageSearchInput.addEventListener('click', (e) => e.stopPropagation()); // Prevent dropdown from closing
        languageSearchInput.addEventListener('keyup', filterLanguageDropdown);
    }
    
    // Apply the saved theme from local storage on page load.
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

/**
 * Sets up all event listeners and third-party logins for the login page.
 */
function initializeLoginPage() {
    // If a user is already logged in, send them directly to the chat page.
    if (localStorage.getItem('loggedInUserIdentifier')) {
        window.location.href = 'index.html';
        return; // Stop running the rest of the function.
    }

    // Select all necessary elements from the login page DOM.
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.querySelector(".login-button");
    const googleButtonContainer = document.getElementById("google-btn");
    const microsoftButton = document.querySelector(".microsoft-btn");

    // Initialize Google Sign-In button and functionality.
    if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse
        });
        google.accounts.id.renderButton(googleButtonContainer, {
            theme: "outline",
            size: "large"
        });
    } else if (googleButtonContainer) {
        googleButtonContainer.innerHTML = `<p class="text-danger small">Could not load Google Sign-In.</p>`;
    }

    // Initialize Microsoft Sign-In (MSAL) button and functionality.
    const msalInstance = typeof msal !== 'undefined' ? new msal.PublicClientApplication({
        auth: {
            clientId: MSAL_CLIENT_ID
        }
    }) : null;

    if (msalInstance && microsoftButton) {
        microsoftButton.addEventListener("click", (e) => {
            e.preventDefault();
            msalInstance.loginPopup({
                scopes: ["User.Read"]
            }).then(handleMicrosoftLoginResponse).catch(err => console.error("MSAL Popup Error:", err));
        });
    }

    // Initialize standard email/password login button.
    if (loginButton) {
        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!emailInput || !passwordInput || !emailInput.value || !passwordInput.value) {
                showUIMessage("Please fill in both email and password!", 'warning', 'profileinfo');
                return;
            }
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value.trim(), password: passwordInput.value.trim() })
                });
                const result = await response.json();
                if (response.ok) {
                    handleLoginSuccess('email', emailInput.value.trim());
                } else {
                    showUIMessage(result.error || 'Login failed.', 'danger', 'profileinfo');
                }
            } catch (err) {
                showUIMessage("Cannot reach the server.", 'danger', 'profileinfo');
            }
        });
    }
}
