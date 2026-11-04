'use strict';

// Covers the same ~24 languages the app already supports elsewhere (TTS
// engines, Wikipedia search) — anything outside that set falls back to
// English rather than leaving half the app translated and half not.
const CS_TRANSLATIONS = {
    en: { cs_celebrity_chat: 'Celebrity Chat', cs_heading: 'Create Your Own Character', cs_desc: 'Make up a name and personality — no real person involved. Optionally record your own voice (or someone else\'s, with their consent) for the character to speak with.', cs_name_label: 'Name', cs_name_placeholder: 'e.g. Captain Nova', cs_personality_label: 'Personality', cs_personality_placeholder: 'e.g. An upbeat, sarcastic space explorer who loves cheesy jokes and gives surprisingly good advice.', cs_voice_label: 'Voice (optional)', cs_voice_desc: 'Read this out loud, clearly, in a quiet room — the longer and cleaner this recording is, the less robotic the clone will sound (aim for at least 15-20 seconds):', cs_phrase: '"Hi there, this is my own voice, and I\'m excited to bring my character to life. I like walking outside on a sunny afternoon, grabbing a coffee with friends, and talking about whatever comes to mind. It\'s funny how a normal Tuesday can turn into one of the best days of the week if you\'re around the right people."', cs_record: 'Record', cs_stop: 'Stop', cs_rerecord: 'Re-record', cs_create: 'Create Character' },
    tr: { cs_celebrity_chat: 'Ünlü Sohbeti', cs_heading: 'Kendi Karakterini Oluştur', cs_desc: 'Bir isim ve kişilik uydurun — gerçek bir kişi söz konusu değil. İsterseniz karakterin konuşması için kendi sesinizi (veya izniyle başka birinin sesini) kaydedebilirsiniz.', cs_name_label: 'İsim', cs_name_placeholder: 'örn. Kaptan Nova', cs_personality_label: 'Kişilik', cs_personality_placeholder: 'örn. Kötü şakalar yapmayı seven, şaşırtıcı derecede iyi tavsiyeler veren, neşeli ve alaycı bir uzay kaşifi.', cs_voice_label: 'Ses (isteğe bağlı)', cs_voice_desc: 'Bunu sessiz bir odada, net bir şekilde yüksek sesle okuyun — kayıt ne kadar uzun ve temiz olursa, klon o kadar az robotik sesler (en az 15-20 saniye hedefleyin):', cs_phrase: '"Merhaba, bu benim kendi sesim ve karakterime hayat vermek için heyecanlıyım. Güneşli bir öğleden sonra dışarıda yürümeyi, arkadaşlarımla kahve içmeyi ve aklıma gelen her şey hakkında konuşmayı severim. Sıradan bir Salı gününün, doğru insanlarla birlikteyken haftanın en güzel günlerinden birine dönüşmesi ne komik."', cs_record: 'Kaydet', cs_stop: 'Durdur', cs_rerecord: 'Yeniden kaydet', cs_create: 'Karakter Oluştur' },
    es: { cs_celebrity_chat: 'Chat de Celebridades', cs_heading: 'Crea Tu Propio Personaje', cs_desc: 'Inventa un nombre y una personalidad — sin ninguna persona real involucrada. Opcionalmente graba tu propia voz (o la de otra persona, con su consentimiento) para que el personaje hable con ella.', cs_name_label: 'Nombre', cs_name_placeholder: 'ej. Capitán Nova', cs_personality_label: 'Personalidad', cs_personality_placeholder: 'ej. Un explorador espacial optimista y sarcástico que ama los chistes malos y da consejos sorprendentemente buenos.', cs_voice_label: 'Voz (opcional)', cs_voice_desc: 'Lee esto en voz alta, con claridad, en una habitación silenciosa — cuanto más larga y limpia sea esta grabación, menos robótico sonará el clon (apunta a al menos 15-20 segundos):', cs_phrase: '"Hola, esta es mi propia voz, y estoy emocionado de darle vida a mi personaje. Me gusta caminar afuera en una tarde soleada, tomar un café con amigos y hablar de lo que se me ocurra. Es gracioso cómo un martes normal puede convertirse en uno de los mejores días de la semana si estás con la gente correcta."', cs_record: 'Grabar', cs_stop: 'Detener', cs_rerecord: 'Regrabar', cs_create: 'Crear Personaje' },
    fr: { cs_celebrity_chat: 'Chat de Célébrités', cs_heading: 'Créez Votre Propre Personnage', cs_desc: 'Inventez un nom et une personnalité — aucune personne réelle impliquée. Enregistrez éventuellement votre propre voix (ou celle d\'une autre personne, avec son consentement) pour que le personnage puisse parler avec.', cs_name_label: 'Nom', cs_name_placeholder: 'ex. Capitaine Nova', cs_personality_label: 'Personnalité', cs_personality_placeholder: 'ex. Un explorateur spatial enjoué et sarcastique qui adore les blagues nulles et donne des conseils étonnamment bons.', cs_voice_label: 'Voix (facultatif)', cs_voice_desc: 'Lisez ceci à voix haute, clairement, dans une pièce silencieuse — plus cet enregistrement est long et propre, moins le clone sonnera robotique (visez au moins 15-20 secondes) :', cs_phrase: '"Bonjour, c\'est ma propre voix, et je suis ravi de donner vie à mon personnage. J\'aime me promener dehors par un après-midi ensoleillé, prendre un café avec des amis, et parler de tout ce qui me passe par la tête. C\'est drôle comme un mardi ordinaire peut devenir l\'un des meilleurs jours de la semaine quand on est avec les bonnes personnes."', cs_record: 'Enregistrer', cs_stop: 'Arrêter', cs_rerecord: 'Réenregistrer', cs_create: 'Créer le Personnage' },
    de: { cs_celebrity_chat: 'Promi-Chat', cs_heading: 'Erstelle Deinen Eigenen Charakter', cs_desc: 'Erfinde einen Namen und eine Persönlichkeit — keine echte Person ist beteiligt. Nimm optional deine eigene Stimme auf (oder die einer anderen Person, mit ihrer Zustimmung), damit der Charakter damit sprechen kann.', cs_name_label: 'Name', cs_name_placeholder: 'z.B. Kapitän Nova', cs_personality_label: 'Persönlichkeit', cs_personality_placeholder: 'z.B. Ein fröhlicher, sarkastischer Weltraumforscher, der billige Witze liebt und überraschend gute Ratschläge gibt.', cs_voice_label: 'Stimme (optional)', cs_voice_desc: 'Lies dies laut und deutlich in einem ruhigen Raum vor — je länger und sauberer diese Aufnahme ist, desto weniger roboterhaft klingt der Klon (ziele auf mindestens 15-20 Sekunden ab):', cs_phrase: '"Hallo, das ist meine eigene Stimme, und ich freue mich darauf, meinem Charakter Leben einzuhauchen. Ich gehe gerne an einem sonnigen Nachmittag spazieren, trinke Kaffee mit Freunden und rede über alles, was mir in den Sinn kommt. Es ist lustig, wie ein normaler Dienstag zu einem der besten Tage der Woche werden kann, wenn man mit den richtigen Leuten zusammen ist."', cs_record: 'Aufnehmen', cs_stop: 'Stopp', cs_rerecord: 'Neu aufnehmen', cs_create: 'Charakter Erstellen' },
    it: { cs_celebrity_chat: 'Chat con Celebrità', cs_heading: 'Crea il Tuo Personaggio', cs_desc: 'Inventa un nome e una personalità — nessuna persona reale coinvolta. Facoltativamente registra la tua voce (o quella di qualcun altro, con il suo consenso) per far parlare il personaggio.', cs_name_label: 'Nome', cs_name_placeholder: 'es. Capitano Nova', cs_personality_label: 'Personalità', cs_personality_placeholder: 'es. Un esploratore spaziale allegro e sarcastico che ama le battute scadenti e dà consigli sorprendentemente buoni.', cs_voice_label: 'Voce (opzionale)', cs_voice_desc: 'Leggi questo ad alta voce, chiaramente, in una stanza silenziosa — più lunga e pulita è questa registrazione, meno robotico suonerà il clone (punta ad almeno 15-20 secondi):', cs_phrase: '"Ciao, questa è la mia vera voce, e sono entusiasta di dare vita al mio personaggio. Mi piace camminare all\'aperto in un pomeriggio di sole, prendere un caffè con gli amici e parlare di qualsiasi cosa mi venga in mente. È buffo come un normale martedì possa trasformarsi in uno dei giorni migliori della settimana se sei con le persone giuste."', cs_record: 'Registra', cs_stop: 'Ferma', cs_rerecord: 'Registra di nuovo', cs_create: 'Crea Personaggio' },
    pt: { cs_celebrity_chat: 'Chat de Celebridades', cs_heading: 'Crie Seu Próprio Personagem', cs_desc: 'Invente um nome e uma personalidade — nenhuma pessoa real envolvida. Opcionalmente grave sua própria voz (ou a de outra pessoa, com o consentimento dela) para o personagem falar.', cs_name_label: 'Nome', cs_name_placeholder: 'ex. Capitão Nova', cs_personality_label: 'Personalidade', cs_personality_placeholder: 'ex. Um explorador espacial animado e sarcástico que adora piadas bobas e dá conselhos surpreendentemente bons.', cs_voice_label: 'Voz (opcional)', cs_voice_desc: 'Leia isso em voz alta, com clareza, em um quarto silencioso — quanto mais longa e limpa for esta gravação, menos robótico o clone soará (procure pelo menos 15-20 segundos):', cs_phrase: '"Olá, esta é minha própria voz, e estou animado para dar vida ao meu personagem. Gosto de caminhar lá fora em uma tarde ensolarada, tomar um café com amigos e falar sobre qualquer coisa que vier à mente. É engraçado como uma terça-feira normal pode se transformar em um dos melhores dias da semana se você estiver com as pessoas certas."', cs_record: 'Gravar', cs_stop: 'Parar', cs_rerecord: 'Regravar', cs_create: 'Criar Personagem' },
    ru: { cs_celebrity_chat: 'Чат со Знаменитостями', cs_heading: 'Создайте Своего Персонажа', cs_desc: 'Придумайте имя и характер — реальный человек не участвует. При желании запишите свой голос (или голос другого человека с его согласия), чтобы персонаж говорил им.', cs_name_label: 'Имя', cs_name_placeholder: 'напр. Капитан Нова', cs_personality_label: 'Характер', cs_personality_placeholder: 'напр. Жизнерадостный, саркастичный космический исследователь, который любит глупые шутки и дает удивительно хорошие советы.', cs_voice_label: 'Голос (необязательно)', cs_voice_desc: 'Прочитайте это вслух, четко, в тихой комнате — чем длиннее и чище будет запись, тем менее роботизированным будет звучать клон (стремитесь минимум к 15-20 секундам):', cs_phrase: '"Привет, это мой собственный голос, и я рад оживить своего персонажа. Мне нравится гулять на улице солнечным днем, пить кофе с друзьями и говорить обо всем, что приходит в голову. Забавно, как обычный вторник может превратиться в один из лучших дней недели, если ты рядом с нужными людьми."', cs_record: 'Записать', cs_stop: 'Стоп', cs_rerecord: 'Перезаписать', cs_create: 'Создать Персонажа' },
    zh: { cs_celebrity_chat: '名人聊天', cs_heading: '创建你自己的角色', cs_desc: '编一个名字和性格——不涉及真实人物。你也可以录制自己的声音（或者征得同意后录制他人的声音）让角色用来说话。', cs_name_label: '名字', cs_name_placeholder: '例如：新星船长', cs_personality_label: '性格', cs_personality_placeholder: '例如：一个乐观、爱讽刺、喜欢讲蹩脚笑话、却总能给出出人意料的好建议的太空探险家。', cs_voice_label: '声音（可选）', cs_voice_desc: '请在安静的房间里清晰地大声朗读——录音越长越干净，克隆出的声音就越不像机器人（目标至少15-20秒）：', cs_phrase: '"你好，这是我自己的声音，我很期待赋予我的角色生命。我喜欢在阳光明媚的下午出去走走，和朋友喝咖啡，聊聊想到的任何事情。有趣的是，如果和对的人在一起，普通的星期二也能变成一周中最美好的日子之一。"', cs_record: '录音', cs_stop: '停止', cs_rerecord: '重新录制', cs_create: '创建角色' },
    ja: { cs_celebrity_chat: '有名人チャット', cs_heading: '自分だけのキャラクターを作成', cs_desc: '名前と性格を自由に考えてください——実在の人物ではありません。キャラクターが話すために、自分の声（または同意を得た他の人の声）を録音することもできます。', cs_name_label: '名前', cs_name_placeholder: '例：キャプテン・ノヴァ', cs_personality_label: '性格', cs_personality_placeholder: '例：明るくて皮肉屋な宇宙探検家で、くだらないジョークが大好きで、意外と良いアドバイスをくれる。', cs_voice_label: '声（任意）', cs_voice_desc: '静かな部屋ではっきりと声に出して読んでください——録音が長くきれいであるほど、クローンの声はロボットっぽくなくなります（最低15〜20秒を目安に）：', cs_phrase: '「こんにちは、これは私自身の声です。自分のキャラクターに命を吹き込めることにワクワクしています。晴れた午後に外を歩いたり、友達とコーヒーを飲んだり、思いついたことを何でも話すのが好きです。普通の火曜日でも、良い人たちと一緒なら週の最高の一日になるなんて面白いですよね。」', cs_record: '録音', cs_stop: '停止', cs_rerecord: '再録音', cs_create: 'キャラクターを作成' },
    ko: { cs_celebrity_chat: '유명인 채팅', cs_heading: '나만의 캐릭터 만들기', cs_desc: '이름과 성격을 지어내세요 — 실제 인물은 관련이 없습니다. 원한다면 캐릭터가 말할 때 사용할 자신의 목소리(또는 동의를 받은 다른 사람의 목소리)를 녹음할 수 있습니다.', cs_name_label: '이름', cs_name_placeholder: '예: 캡틴 노바', cs_personality_label: '성격', cs_personality_placeholder: '예: 유쾌하고 빈정대는 우주 탐험가로, 썰렁한 농담을 좋아하고 의외로 좋은 조언을 해준다.', cs_voice_label: '목소리 (선택)', cs_voice_desc: '조용한 방에서 이 문장을 또렷하게 소리 내어 읽어주세요 — 녹음이 길고 깨끗할수록 복제된 목소리가 덜 로봇처럼 들립니다 (최소 15-20초를 목표로 하세요):', cs_phrase: '"안녕하세요, 이건 제 본연의 목소리이고, 제 캐릭터에 생명을 불어넣게 되어 기대돼요. 저는 화창한 오후에 밖에서 산책하고, 친구들과 커피를 마시고, 떠오르는 대로 이런저런 이야기를 나누는 걸 좋아해요. 평범한 화요일도 좋은 사람들과 함께라면 한 주 중 최고의 날이 될 수 있다는 게 재미있죠."', cs_record: '녹음', cs_stop: '정지', cs_rerecord: '다시 녹음', cs_create: '캐릭터 만들기' },
    ar: { cs_celebrity_chat: 'دردشة المشاهير', cs_heading: 'أنشئ شخصيتك الخاصة', cs_desc: 'اخترع اسمًا وشخصية — لا يوجد شخص حقيقي هنا. يمكنك اختياريًا تسجيل صوتك (أو صوت شخص آخر، بموافقته) لتتحدث به الشخصية.', cs_name_label: 'الاسم', cs_name_placeholder: 'مثال: الكابتن نوفا', cs_personality_label: 'الشخصية', cs_personality_placeholder: 'مثال: مستكشف فضائي متفائل وساخر يحب النكات السخيفة ويقدم نصائح جيدة بشكل مفاجئ.', cs_voice_label: 'الصوت (اختياري)', cs_voice_desc: 'اقرأ هذا بصوت عالٍ وبوضوح في غرفة هادئة — كلما كان التسجيل أطول وأنظف، كان الصوت المستنسخ أقل شبهاً بالروبوت (استهدف 15-20 ثانية على الأقل):', cs_phrase: '"مرحباً، هذا صوتي الحقيقي، وأنا متحمس لبث الحياة في شخصيتي. أحب المشي في الخارج في فترة بعد ظهر مشمسة، واحتساء القهوة مع الأصدقاء، والحديث عن أي شيء يخطر ببالي. من المضحك كيف يمكن ليوم ثلاثاء عادي أن يتحول إلى أحد أفضل أيام الأسبوع إذا كنت مع الأشخاص المناسبين."', cs_record: 'تسجيل', cs_stop: 'إيقاف', cs_rerecord: 'إعادة التسجيل', cs_create: 'إنشاء الشخصية' },
    hi: { cs_celebrity_chat: 'सेलिब्रिटी चैट', cs_heading: 'अपना खुद का किरदार बनाएं', cs_desc: 'एक नाम और व्यक्तित्व बनाएं — कोई असली व्यक्ति शामिल नहीं है। चाहें तो किरदार के बोलने के लिए अपनी आवाज़ (या किसी और की, उनकी सहमति से) रिकॉर्ड करें।', cs_name_label: 'नाम', cs_name_placeholder: 'जैसे: कैप्टन नोवा', cs_personality_label: 'व्यक्तित्व', cs_personality_placeholder: 'जैसे: एक उत्साही, व्यंग्यात्मक अंतरिक्ष खोजकर्ता जो घटिया चुटकुले पसंद करता है और आश्चर्यजनक रूप से अच्छी सलाह देता है।', cs_voice_label: 'आवाज़ (वैकल्पिक)', cs_voice_desc: 'इसे शांत कमरे में साफ़ और ज़ोर से पढ़ें — यह रिकॉर्डिंग जितनी लंबी और साफ़ होगी, क्लोन उतनी ही कम रोबोटिक लगेगी (कम से कम 15-20 सेकंड का लक्ष्य रखें):', cs_phrase: '"नमस्ते, यह मेरी अपनी आवाज़ है, और मैं अपने किरदार में जान डालने के लिए उत्साहित हूं। मुझे धूप भरी दोपहर में बाहर टहलना, दोस्तों के साथ कॉफी पीना, और जो भी मन में आए उस पर बात करना पसंद है। यह मज़ेदार है कि सही लोगों के साथ होने पर एक साधारण मंगलवार भी हफ्ते के सबसे अच्छे दिनों में से एक बन सकता है।"', cs_record: 'रिकॉर्ड करें', cs_stop: 'रोकें', cs_rerecord: 'फिर से रिकॉर्ड करें', cs_create: 'किरदार बनाएं' },
    nl: { cs_celebrity_chat: 'Beroemdheden Chat', cs_heading: 'Maak Je Eigen Personage', cs_desc: 'Verzin een naam en persoonlijkheid — geen echte persoon betrokken. Neem eventueel je eigen stem op (of die van iemand anders, met hun toestemming) waarmee het personage kan spreken.', cs_name_label: 'Naam', cs_name_placeholder: 'bijv. Kapitein Nova', cs_personality_label: 'Persoonlijkheid', cs_personality_placeholder: 'bijv. Een vrolijke, sarcastische ruimteverkenner die van flauwe grappen houdt en verrassend goed advies geeft.', cs_voice_label: 'Stem (optioneel)', cs_voice_desc: 'Lees dit hardop en duidelijk voor in een stille kamer — hoe langer en schoner deze opname is, hoe minder robotisch de kloon zal klinken (streef naar minstens 15-20 seconden):', cs_phrase: '"Hoi, dit is mijn eigen stem, en ik kan niet wachten om mijn personage tot leven te brengen. Ik loop graag buiten op een zonnige middag, drink koffie met vrienden, en praat over van alles wat in me opkomt. Het is grappig hoe een gewone dinsdag een van de beste dagen van de week kan worden als je bij de juiste mensen bent."', cs_record: 'Opnemen', cs_stop: 'Stop', cs_rerecord: 'Opnieuw opnemen', cs_create: 'Personage Maken' },
    pl: { cs_celebrity_chat: 'Czat z Gwiazdami', cs_heading: 'Stwórz Własną Postać', cs_desc: 'Wymyśl imię i osobowość — bez udziału prawdziwej osoby. Opcjonalnie nagraj swój głos (lub czyjś, za jego zgodą), aby postać mogła nim mówić.', cs_name_label: 'Imię', cs_name_placeholder: 'np. Kapitan Nova', cs_personality_label: 'Osobowość', cs_personality_placeholder: 'np. Pogodny, sarkastyczny odkrywca kosmosu, który uwielbia tandetne żarty i daje zaskakująco dobre rady.', cs_voice_label: 'Głos (opcjonalnie)', cs_voice_desc: 'Przeczytaj to na głos, wyraźnie, w cichym pokoju — im dłuższe i czystsze jest to nagranie, tym mniej robotycznie zabrzmi klon (celuj w co najmniej 15-20 sekund):', cs_phrase: '"Cześć, to mój własny głos i nie mogę się doczekać, żeby tchnąć życie w moją postać. Lubię spacerować na zewnątrz w słoneczne popołudnie, pić kawę ze znajomymi i rozmawiać o wszystkim, co przyjdzie mi do głowy. To zabawne, jak zwykły wtorek może zamienić się w jeden z najlepszych dni tygodnia, gdy jesteś z odpowiednimi ludźmi."', cs_record: 'Nagraj', cs_stop: 'Zatrzymaj', cs_rerecord: 'Nagraj ponownie', cs_create: 'Stwórz Postać' },
    sv: { cs_celebrity_chat: 'Kändischatt', cs_heading: 'Skapa Din Egen Karaktär', cs_desc: 'Hitta på ett namn och en personlighet — ingen riktig person är inblandad. Spela eventuellt in din egen röst (eller någon annans, med deras samtycke) som karaktären ska tala med.', cs_name_label: 'Namn', cs_name_placeholder: 't.ex. Kapten Nova', cs_personality_label: 'Personlighet', cs_personality_placeholder: 't.ex. En glad, sarkastisk rymdutforskare som älskar töntiga skämt och ger förvånansvärt bra råd.', cs_voice_label: 'Röst (valfritt)', cs_voice_desc: 'Läs detta högt och tydligt i ett tyst rum — ju längre och renare inspelningen är, desto mindre robotisk låter klonen (sikta på minst 15-20 sekunder):', cs_phrase: '"Hej, det här är min egen röst, och jag är exalterad över att väcka min karaktär till liv. Jag gillar att promenera ute en solig eftermiddag, dricka kaffe med vänner och prata om vad som helst som dyker upp i huvudet. Det är roligt hur en vanlig tisdag kan bli en av veckans bästa dagar om man är med rätt sällskap."', cs_record: 'Spela in', cs_stop: 'Stoppa', cs_rerecord: 'Spela in igen', cs_create: 'Skapa Karaktär' },
    da: { cs_celebrity_chat: 'Kendis Chat', cs_heading: 'Opret Din Egen Karakter', cs_desc: 'Find på et navn og en personlighed — ingen rigtig person er involveret. Optag eventuelt din egen stemme (eller en andens, med deres samtykke) som karakteren skal tale med.', cs_name_label: 'Navn', cs_name_placeholder: 'f.eks. Kaptajn Nova', cs_personality_label: 'Personlighed', cs_personality_placeholder: 'f.eks. En munter, sarkastisk rumforsker, der elsker dårlige jokes og giver overraskende gode råd.', cs_voice_label: 'Stemme (valgfrit)', cs_voice_desc: 'Læs dette højt og tydeligt op i et stille rum — jo længere og renere denne optagelse er, desto mindre robotagtig lyder klonen (sigt efter mindst 15-20 sekunder):', cs_phrase: '"Hej, det her er min egen stemme, og jeg er spændt på at give min karakter liv. Jeg kan lide at gå udenfor en solrig eftermiddag, drikke kaffe med venner og snakke om alt muligt, der falder mig ind. Det er sjovt, hvordan en almindelig tirsdag kan blive en af ugens bedste dage, hvis man er sammen med de rigtige mennesker."', cs_record: 'Optag', cs_stop: 'Stop', cs_rerecord: 'Optag igen', cs_create: 'Opret Karakter' },
    no: { cs_celebrity_chat: 'Kjendischat', cs_heading: 'Lag Din Egen Karakter', cs_desc: 'Finn på et navn og en personlighet — ingen ekte person er involvert. Ta eventuelt opp din egen stemme (eller noen andres, med deres samtykke) som karakteren skal snakke med.', cs_name_label: 'Navn', cs_name_placeholder: 'f.eks. Kaptein Nova', cs_personality_label: 'Personlighet', cs_personality_placeholder: 'f.eks. En munter, sarkastisk romutforsker som elsker dårlige vitser og gir overraskende gode råd.', cs_voice_label: 'Stemme (valgfritt)', cs_voice_desc: 'Les dette høyt og tydelig i et stille rom — jo lengre og renere opptaket er, desto mindre robotaktig høres klonen ut (sikt mot minst 15-20 sekunder):', cs_phrase: '"Hei, dette er min egen stemme, og jeg gleder meg til å gi liv til karakteren min. Jeg liker å gå tur ute en solfylt ettermiddag, drikke kaffe med venner, og snakke om alt som faller meg inn. Det er morsomt hvordan en vanlig tirsdag kan bli en av ukens beste dager hvis du er med de rette folkene."', cs_record: 'Ta opp', cs_stop: 'Stopp', cs_rerecord: 'Ta opp igjen', cs_create: 'Lag Karakter' },
    fi: { cs_celebrity_chat: 'Julkkischatti', cs_heading: 'Luo Oma Hahmosi', cs_desc: 'Keksi nimi ja persoonallisuus — mukana ei ole oikeaa henkilöä. Voit halutessasi äänittää oman äänesi (tai jonkun toisen, hänen suostumuksellaan), jolla hahmo puhuu.', cs_name_label: 'Nimi', cs_name_placeholder: 'esim. Kapteeni Nova', cs_personality_label: 'Persoonallisuus', cs_personality_placeholder: 'esim. Iloinen, sarkastinen avaruudentutkija, joka rakastaa huonoja vitsejä ja antaa yllättävän hyviä neuvoja.', cs_voice_label: 'Ääni (valinnainen)', cs_voice_desc: 'Lue tämä ääneen selkeästi hiljaisessa huoneessa — mitä pidempi ja puhtaampi äänitys on, sitä vähemmän robottimaiselta klooni kuulostaa (tähtää vähintään 15-20 sekuntiin):', cs_phrase: '"Hei, tämä on oma ääneni, ja odotan innolla saavani herättää hahmoni eloon. Pidän ulkona kävelystä aurinkoisena iltapäivänä, kahvin juomisesta ystävien kanssa ja puhumisesta mistä tahansa mieleen tulevasta. On hauskaa, miten tavallisesta tiistaista voi tulla yksi viikon parhaista päivistä, kun on oikeiden ihmisten seurassa."', cs_record: 'Äänitä', cs_stop: 'Pysäytä', cs_rerecord: 'Äänitä uudelleen', cs_create: 'Luo Hahmo' },
    el: { cs_celebrity_chat: 'Συνομιλία Διασήμων', cs_heading: 'Δημιούργησε Τον Δικό Σου Χαρακτήρα', cs_desc: 'Σκέψου ένα όνομα και έναν χαρακτήρα — δεν εμπλέκεται πραγματικό πρόσωπο. Προαιρετικά ηχογράφησε τη δική σου φωνή (ή κάποιου άλλου, με τη συγκατάθεσή του) για να μιλάει ο χαρακτήρας.', cs_name_label: 'Όνομα', cs_name_placeholder: 'π.χ. Καπετάνιος Νόβα', cs_personality_label: 'Χαρακτήρας', cs_personality_placeholder: 'π.χ. Ένας κεφάτος, σαρκαστικός εξερευνητής του διαστήματος που λατρεύει τα κακά αστεία και δίνει εκπληκτικά καλές συμβουλές.', cs_voice_label: 'Φωνή (προαιρετικό)', cs_voice_desc: 'Διάβασέ το δυνατά, καθαρά, σε ένα ήσυχο δωμάτιο — όσο πιο μακριά και καθαρή είναι αυτή η ηχογράφηση, τόσο λιγότερο ρομποτικός θα ακούγεται ο κλώνος (στόχευσε τουλάχιστον 15-20 δευτερόλεπτα):', cs_phrase: '"Γεια σου, αυτή είναι η δική μου φωνή, και ανυπομονώ να δώσω ζωή στον χαρακτήρα μου. Μου αρέσει να περπατάω έξω ένα ηλιόλουστο απόγευμα, να πίνω καφέ με φίλους, και να μιλάω για οτιδήποτε μου έρχεται στο μυαλό. Είναι αστείο πώς μια συνηθισμένη Τρίτη μπορεί να γίνει μία από τις καλύτερες μέρες της εβδομάδας αν είσαι με τους σωστούς ανθρώπους."', cs_record: 'Ηχογράφηση', cs_stop: 'Διακοπή', cs_rerecord: 'Νέα ηχογράφηση', cs_create: 'Δημιουργία Χαρακτήρα' },
    hu: { cs_celebrity_chat: 'Híresség Chat', cs_heading: 'Hozd Létre Saját Karakteredet', cs_desc: 'Találj ki egy nevet és egy személyiséget — nincs szó valódi személyről. Opcionálisan rögzítsd a saját hangodat (vagy valaki másét, az ő hozzájárulásával), amivel a karakter beszélhet.', cs_name_label: 'Név', cs_name_placeholder: 'pl. Nova kapitány', cs_personality_label: 'Személyiség', cs_personality_placeholder: 'pl. Egy vidám, szarkasztikus űrfelfedező, aki imádja a béna vicceket, és meglepően jó tanácsokat ad.', cs_voice_label: 'Hang (opcionális)', cs_voice_desc: 'Olvasd fel hangosan, tisztán, egy csendes szobában — minél hosszabb és tisztább ez a felvétel, annál kevésbé fog robotikusan hangzani a klón (célozz legalább 15-20 másodpercre):', cs_phrase: '"Szia, ez a saját hangom, és izgatottan várom, hogy életre keltsem a karakteremet. Szeretek egy napsütéses délutánon kint sétálni, kávézni a barátaimmal, és bármiről beszélgetni, ami eszembe jut. Vicces, hogy egy hétköznapi kedd is a hét egyik legjobb napjává válhat, ha a megfelelő emberekkel vagy."', cs_record: 'Felvétel', cs_stop: 'Leállítás', cs_rerecord: 'Újra felvétel', cs_create: 'Karakter Létrehozása' },
    cs: { cs_celebrity_chat: 'Chat se Slavnými', cs_heading: 'Vytvoř Si Vlastní Postavu', cs_desc: 'Vymysli jméno a osobnost — nejde o skutečnou osobu. Volitelně nahraj svůj vlastní hlas (nebo hlas někoho jiného, s jeho souhlasem), kterým bude postava mluvit.', cs_name_label: 'Jméno', cs_name_placeholder: 'např. Kapitán Nova', cs_personality_label: 'Osobnost', cs_personality_placeholder: 'např. Veselý, sarkastický vesmírný průzkumník, který miluje ubohé vtipy a dává překvapivě dobré rady.', cs_voice_label: 'Hlas (volitelné)', cs_voice_desc: 'Přečti si toto nahlas, zřetelně, v tiché místnosti — čím delší a čistší je tato nahrávka, tím méně robotický bude klon znít (cíl je alespoň 15-20 sekund):', cs_phrase: '"Ahoj, tohle je můj vlastní hlas, a těším se, až vdechnu život své postavě. Rád chodím ven na procházku slunečné odpoledne, dávám si kávu s přáteli a mluvím o čemkoli, co mě napadne. Je zábavné, jak se obyčejné úterý může proměnit v jeden z nejlepších dnů týdne, když jste se správnými lidmi."', cs_record: 'Nahrát', cs_stop: 'Zastavit', cs_rerecord: 'Nahrát znovu', cs_create: 'Vytvořit Postavu' },
    ro: { cs_celebrity_chat: 'Chat cu Vedete', cs_heading: 'Creează-ți Propriul Personaj', cs_desc: 'Inventează un nume și o personalitate — nicio persoană reală nu este implicată. Opțional, înregistrează-ți vocea (sau a altcuiva, cu consimțământul lor) cu care personajul să vorbească.', cs_name_label: 'Nume', cs_name_placeholder: 'ex. Căpitanul Nova', cs_personality_label: 'Personalitate', cs_personality_placeholder: 'ex. Un explorator spațial vesel și sarcastic, căruia îi plac glumele proaste și oferă sfaturi surprinzător de bune.', cs_voice_label: 'Voce (opțional)', cs_voice_desc: 'Citește asta cu voce tare, clar, într-o cameră liniștită — cu cât această înregistrare este mai lungă și mai curată, cu atât clona va suna mai puțin robotică (țintește cel puțin 15-20 de secunde):', cs_phrase: '"Salut, aceasta este vocea mea reală, și sunt încântat să dau viață personajului meu. Îmi place să merg afară într-o după-amiază însorită, să beau o cafea cu prietenii și să vorbesc despre orice îmi vine în minte. E amuzant cum o marți obișnuită se poate transforma într-una dintre cele mai bune zile ale săptămânii dacă ești alături de oamenii potriviți."', cs_record: 'Înregistrează', cs_stop: 'Oprește', cs_rerecord: 'Reînregistrează', cs_create: 'Creează Personaj' },
    uk: { cs_celebrity_chat: 'Чат зі Знаменитостями', cs_heading: 'Створи Свого Персонажа', cs_desc: 'Придумай ім\'я та характер — реальна людина не задіяна. За бажанням запиши свій голос (або голос іншої людини за її згодою), яким персонаж говоритиме.', cs_name_label: 'Ім\'я', cs_name_placeholder: 'напр. Капітан Нова', cs_personality_label: 'Характер', cs_personality_placeholder: 'напр. Життєрадісний, саркастичний космічний дослідник, який любить дурні жарти й дає напрочуд хороші поради.', cs_voice_label: 'Голос (необов\'язково)', cs_voice_desc: 'Прочитай це вголос, чітко, у тихій кімнаті — чим довший і чистіший цей запис, тим менш роботизованим звучатиме клон (орієнтуйся щонайменше на 15-20 секунд):', cs_phrase: '"Привіт, це мій власний голос, і я радий оживити свого персонажа. Мені подобається гуляти надворі сонячного дня, пити каву з друзями і говорити про все, що спадає на думку. Кумедно, як звичайний вівторок може стати одним з найкращих днів тижня, якщо ти поруч із правильними людьми."', cs_record: 'Записати', cs_stop: 'Зупинити', cs_rerecord: 'Перезаписати', cs_create: 'Створити Персонажа' },
};

function applyCharacterStudioTranslations() {
    const langCode = localStorage.getItem('ibochat_ui_lang') || 'en';
    const dict = CS_TRANSLATIONS[langCode] || CS_TRANSLATIONS.en;
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        const text = dict[key];
        if (!text) return;
        if ('placeholder' in el && el.hasAttribute('placeholder')) {
            el.placeholder = text;
        } else {
            const icon = el.querySelector('i');
            el.textContent = text;
            if (icon) el.prepend(icon, ' ');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyCharacterStudioTranslations();
    const loggedInUserIdentifier = localStorage.getItem('loggedInUserIdentifier');
    if (!loggedInUserIdentifier) {
        window.location.href = 'login.html';
        return;
    }

    const loggedInUserSpan = document.getElementById('logged-in-user');
    if (loggedInUserSpan) loggedInUserSpan.textContent = loggedInUserIdentifier;

    const recordBtn      = document.getElementById('recordBtn');
    const stopBtn         = document.getElementById('stopBtn');
    const recordStatus    = document.getElementById('recordStatus');
    const playbackWrap    = document.getElementById('playbackWrap');
    const playbackAudio   = document.getElementById('playbackAudio');
    const reRecordBtn     = document.getElementById('reRecordBtn');
    const form            = document.getElementById('characterForm');
    const createBtn       = document.getElementById('createBtn');
    const createResult    = document.getElementById('createResult');

    let mediaRecorder = null;
    let recordedChunks = [];
    let recordedBlob = null;
    let recordStartTime = 0;
    let recordTimerInterval = null;
    // A clone learns almost nothing from a 3-4 second clip — celebrity voices
    // (which sound noticeably better) are cloned from 20-45s curated clips.
    // Refuse anything under this so a rushed recording can't silently produce
    // a bad, "AI-sounding" clone.
    const MIN_RECORDING_SECONDS = 12;
    // MediaRecorder.stop() is async — recordedBlob isn't actually set until
    // the onstop event fires, which can lag behind the UI already showing
    // "Recorded". An eager click on Create right after Stop could submit
    // before that happens, silently sending no voice sample at all — the
    // character gets created but ends up on the default voice, indistinguishable
    // from having skipped recording entirely. This promise lets the submit
    // handler wait for finalization to actually finish first.
    let recordingFinalized = Promise.resolve();

    // getUserMedia only exists in a secure context (https://, or localhost/
    // 127.0.0.1). Over plain http:// on a LAN IP or non-localhost domain,
    // navigator.mediaDevices is simply undefined and the Record button looks
    // like it's doing nothing when clicked — nothing throws, nothing logs,
    // because the click handler itself was never even attached.
    if (!window.isSecureContext) {
        recordBtn.disabled = true;
        const localUrl = `http://localhost:${window.location.port || 5005}${window.location.pathname}`;
        const banner = document.createElement('div');
        banner.className = 'alert alert-warning mt-2';
        banner.innerHTML = `<strong>Microphone is blocked here.</strong> You're loading this page from ` +
            `<code>${window.location.host}</code>, and browsers only allow mic access over HTTPS or ` +
            `<code>localhost</code>. Open <a href="${localUrl}">${localUrl}</a> instead to record.`;
        recordBtn.insertAdjacentElement('afterend', banner);
        console.warn('[create-character] insecure context — mic disabled. location:', window.location.href);
    } else if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        recordBtn.disabled = true;
        recordStatus.textContent = 'Your browser does not support microphone recording.';
        console.warn('[create-character] navigator.mediaDevices unavailable in this browser.');
    } else {
        console.log('[create-character] mic recording available, attaching record handler.');
    }

    async function startRecording() {
        try {
            // Explicit constraints instead of `audio: true` — default browser
            // capture is tuned for calls (aggressive noise/echo suppression,
            // low sample rate), which strips exactly the detail a voice clone
            // needs. Ask for the highest-quality capture the device offers.
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    channelCount: 1,
                    sampleRate: 48000,
                }
            });
            recordedChunks = [];
            const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 }
                : { audioBitsPerSecond: 128000 };
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };
            recordingFinalized = new Promise((resolve) => {
                // onstop fires asynchronously after mediaRecorder.stop() — it's
                // the only place that actually knows the real recorded length,
                // so accept/reject happens here, not in the click handler (which
                // used to race this and get silently overwritten).
                mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(track => track.stop());
                    const elapsedSeconds = (Date.now() - recordStartTime) / 1000;
                    if (elapsedSeconds < MIN_RECORDING_SECONDS) {
                        recordedBlob = null;
                        recordStatus.innerHTML = `<span class="text-danger">Only ${elapsedSeconds.toFixed(0)}s — too short for a good clone (need ${MIN_RECORDING_SECONDS}s+). Please re-record and read the full passage.</span>`;
                        playbackWrap.classList.add('d-none');
                        resolve();
                        return;
                    }
                    recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                    playbackAudio.src = URL.createObjectURL(recordedBlob);
                    playbackWrap.classList.remove('d-none');
                    recordStatus.textContent = `Recorded (${elapsedSeconds.toFixed(0)}s) — you can preview it below, or re-record.`;
                    resolve();
                };
            });
            mediaRecorder.start();
            recordBtn.classList.add('d-none');
            stopBtn.classList.remove('d-none');
            recordStartTime = Date.now();
            clearInterval(recordTimerInterval);
            recordTimerInterval = setInterval(() => {
                const secs = ((Date.now() - recordStartTime) / 1000).toFixed(0);
                recordStatus.textContent = secs < MIN_RECORDING_SECONDS
                    ? `Recording… ${secs}s (keep going — need at least ${MIN_RECORDING_SECONDS}s)`
                    : `Recording… ${secs}s — good, hit Stop whenever you're done.`;
            }, 250);
        } catch (e) {
            console.error('[create-character] mic access failed:', e);
            recordStatus.textContent = 'Could not access your microphone — check browser permissions.';
        }
    }

    recordBtn.addEventListener('click', startRecording);

    stopBtn.addEventListener('click', () => {
        clearInterval(recordTimerInterval);
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        recordBtn.classList.remove('d-none');
        stopBtn.classList.add('d-none');
        recordStatus.textContent = 'Finishing up…';
    });

    // Previously just cleared the old recording and hid the playback,
    // leaving the user to notice the (already-visible) Record button and
    // click that separately — easy to miss, which is why it read as "not
    // working". Now it goes straight into a fresh recording, one click.
    reRecordBtn.addEventListener('click', () => {
        recordedBlob = null;
        playbackWrap.classList.add('d-none');
        startRecording();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('charName').value.trim();
        const personality = document.getElementById('charPersonality').value.trim();
        if (!name || !personality) return;

        createBtn.disabled = true;
        createBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating…';
        createResult.innerHTML = '';

        // In case Stop was just clicked and the recording hasn't actually
        // finished finalizing into recordedBlob yet.
        await recordingFinalized;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('personality', personality);
        formData.append('owner_email', loggedInUserIdentifier);
        if (recordedBlob) {
            formData.append('voice_sample', recordedBlob, 'voice_sample.webm');
        }

        try {
            const resp = await fetch('/api/characters/create', { method: 'POST', body: formData });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status})`);

            // Keep the raw recording on this device too, not just on
            // OmniVoice's server — a local backup that survives even if the
            // server-side clone is ever lost, and lets the character page
            // offer "play my original recording" without a network round-trip.
            if (recordedBlob && typeof IboAudioStore !== 'undefined') {
                IboAudioStore.set(`character_recording::${data.id}`, recordedBlob);
            }

            createResult.innerHTML = `<div class="alert alert-success">
                <strong>${name}</strong> is ready! Redirecting to chat…
            </div>`;
            setTimeout(() => {
                window.location.href = `chat.html?character_id=${encodeURIComponent(data.id)}`;
            }, 1200);
        } catch (err) {
            console.error('[create-character] creation failed:', err);
            createResult.innerHTML = `<div class="alert alert-danger">Couldn't create the character: ${err.message}</div>`;
            createBtn.disabled = false;
            createBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles me-2"></i>Create Character';
        }
    });
});
