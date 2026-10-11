/* Catálogo e regras locais. Produtos e especificações são ilustrativos. */
(function (root) {
  'use strict';
  const categories = {
    all: 'Todos os produtos', laptops: 'Notebooks', smartphones: 'Smartphones',
    audio: 'Áudio', wearables: 'Smartwatches', 'smart-home': 'Casa inteligente',
    gaming: 'Games', cameras: 'Câmeras', accessories: 'Acessórios'
  };
  const products = [
    { id: 'laptop', name: 'NovaBook Pro 14', subtitle: 'Potência e portabilidade', category: 'laptops', price: 529990, image: 'product-laptop-hd.png', rating: '1,2 mil', group: 'trending', description: 'Do trabalho ao entretenimento, um notebook pensado para acompanhar sua rotina em qualquer lugar.', specs: ['Tela de 14 polegadas', 'Design leve e portátil', 'Conectividade para o seu dia a dia'] },
    { id: 'phone', name: 'Zenix X1 5G', subtitle: 'Capture novas possibilidades', category: 'smartphones', price: 329990, image: 'product-phone-hd.png', rating: '856', group: 'trending', isNew: true, description: 'Uma nova perspectiva para suas fotos, conversas e conteúdos favoritos. Tecnologia que cabe na sua mão.', specs: ['Conectividade 5G', 'Conjunto de câmeras traseiras', 'Acabamento em violeta'] },
    { id: 'earbuds', name: 'TuneFlow Pro', subtitle: 'Som puro. Sem limites.', category: 'audio', price: 24990, previousPrice: 29990, image: 'product-earbuds-hd.png', rating: '2,1 mil', group: 'trending', description: 'Sua trilha sonora com liberdade. Fones compactos para acompanhar músicas, chamadas e momentos de concentração.', specs: ['Conexão sem fio', 'Estojo de recarga compacto', 'Formato intra-auricular'] },
    { id: 'watch', name: 'FitNova Max', subtitle: 'Mais saúde. Mais você.', category: 'wearables', price: 34990, image: 'product-watch-hd.png', rating: '1,4 mil', group: 'trending', description: 'Um toque de tecnologia no pulso. Acompanhe sua rotina e mantenha suas informações favoritas por perto.', specs: ['Tela colorida', 'Pulseira ajustável', 'Design esportivo'] },
    { id: 'controller', name: 'NovaPlay Controller', subtitle: 'Jogue além dos limites', category: 'gaming', price: 18990, previousPrice: 22990, image: 'product-controller-hd.png', rating: '743', group: 'trending', description: 'Mais conforto em cada partida. Um controle com formato ergonômico para sua próxima aventura.', specs: ['Formato ergonômico', 'Dois direcionais analógicos', 'Botões de acesso rápido'] },
    { id: 'monitor', name: 'Smart LED Monitor', subtitle: 'Uma nova visão', category: 'accessories', price: 129990, image: 'product-monitor-hd.png', rating: '618', group: 'recommended', description: 'Mais espaço para criar, trabalhar e explorar. Um monitor que dá destaque a cada detalhe.', specs: ['Painel LED', 'Base para mesa', 'Design com bordas finas'] },
    { id: 'keyboard', name: 'Wireless Keyboard', subtitle: 'Mais leveza para digitar', category: 'accessories', price: 12990, image: 'product-keyboard-hd.png', rating: '392', group: 'recommended', description: 'Simplifique sua mesa com um teclado compacto. Conforto e organização para suas tarefas diárias.', specs: ['Conexão sem fio', 'Formato compacto', 'Teclas de perfil baixo'] },
    { id: 'camera', name: '4K Action Camera', subtitle: 'Guarde cada aventura', category: 'cameras', price: 39990, image: 'product-camera-hd.png', rating: '287', group: 'recommended', isNew: true, description: 'Uma câmera pequena para ideias grandes. Registre seus passeios e leve suas histórias com você.', specs: ['Formato compacto', 'Lente grande-angular', 'Visualização em tela'] },
    { id: 'bulbs', name: 'Smart Bulb — Kit com 2', subtitle: 'Sua casa, seu clima', category: 'smart-home', price: 6990, previousPrice: 7990, image: 'product-bulbs-hd.png', rating: '524', group: 'recommended', description: 'Transforme o ambiente com um toque de cor. Um kit para deixar sua casa com a sua personalidade.', specs: ['Kit com duas lâmpadas', 'Iluminação colorida', 'Formato de rosca padrão'] },
    { id: 'ssd', name: 'Portable SSD 1 TB', subtitle: 'Seus arquivos com você', category: 'accessories', price: 49990, image: 'product-ssd-hd.png', rating: '431', group: 'recommended', isNew: true, description: 'Mais espaço para o que importa. Leve fotos, projetos e documentos em um dispositivo compacto.', specs: ['Capacidade ilustrativa de 1 TB', 'Formato portátil', 'Acabamento compacto'] }
  ];

  /* Cada linha é um modelo independente: ID, nome, resumo, preço em centavos,
     imagem, especificações e, opcionalmente, preço anterior / novidade.
     Cada modelo tem imagem própria e características visuais distintas. */
  function extend(category, rows) {
    rows.forEach(([id, name, subtitle, price, image, specs, options = {}], index) => {
      products.push({ id, name, subtitle, category, price, image, specs,
        rating: String(120 + index * 67), group: 'catalog',
        description: `${name}: ${subtitle.toLowerCase()}. Uma opção da seleção ${categories[category]} para acompanhar sua rotina. ${specs.join('. ')}.`,
        ...options });
    });
  }

  extend('laptops', [
    ["novabook-air-13","NovaBook Air 13","Leve para ir mais longe",349990,"laptop-air-gold-hd.png",["Tela de 13,3 polegadas","8 GB RAM e SSD de 256 GB","Chassi ultrafino em acabamento dourado"],{"previousPrice":389990}],
    ["novabook-pro-16","NovaBook Pro 16","Mais espaço para produzir",679990,"laptop-pro-graphite-hd.png",["Tela de 16 polegadas","32 GB RAM e SSD de 1 TB","Chassi grafite com teclado numérico"],{"isNew":true}],
    ["novabook-studio-15","NovaBook Studio 15","Seu espaço para criar",489990,"laptop-studio-white-hd.png",["Tela IPS de 15,6 polegadas","16 GB RAM e SSD de 512 GB","Corpo branco e dobradiça em cobre"]],
    ["novabook-daily-14","NovaBook Daily 14","Prático em cada tarefa",299990,"laptop-daily-navy-hd.png",["Tela Full HD de 14 polegadas","8 GB RAM e SSD de 512 GB","Corpo arredondado em azul-marinho"]],
    ["novabook-flex-13","NovaBook Flex 13","Notebook e tela touch",459990,"laptop-convertible-hd.png",["Tela touch de 13,3 polegadas","Dobradiça de 360 graus","16 GB RAM e SSD de 512 GB"]],
    ["novabook-flex-15","NovaBook Flex 15","Flexibilidade com tela maior",579990,"laptop-flex-plum-hd.png",["Tela touch de 15,6 polegadas","Modo tenda e acabamento ameixa","16 GB RAM e SSD de 1 TB"]],
    ["novabook-play-15","NovaBook Play 15","Entre na próxima partida",599990,"laptop-gaming-hd.png",["Tela de 15,6 polegadas a 144 Hz","16 GB RAM e SSD de 512 GB","Teclado com iluminação RGB"],{"previousPrice":649990}],
    ["novabook-play-17","NovaBook Play 17","Visão ampla para jogar",799990,"laptop-play-red-hd.png",["Tela de 17,3 polegadas a 165 Hz","32 GB RAM e SSD de 1 TB","Chassi reforçado com detalhes e iluminação vermelhos"]],
    ["novabook-creator-16","NovaBook Duo 16","Duas telas para suas ideias",999990,"laptop-creator-duo-hd.png",["Duas telas articuladas com resolução 2,5K","64 GB de memória RAM","SSD de 2 TB"],{"isNew":true}]
  ]);
  extend('smartphones', [
    ["zenix-lite","Zenix Lite 4G","O essencial na sua mão",89990,"phone-silver-hd.png",["Tela de 6,4 polegadas","4 GB RAM e 128 GB de armazenamento","Bateria de 5.000 mAh"]],
    ["zenix-x2","Zenix X2 5G","Mais velocidade para seu dia",249990,"phone-x2-teal-hd.png",["Tela OLED de 6,5 polegadas","8 GB RAM e 256 GB de armazenamento","Corpo verde-menta com câmeras diagonais"],{"previousPrice":279990}],
    ["zenix-ultra","Zenix Ultra 5G","Detalhes que fazem diferença",459990,"phone-ultra-black-hd.png",["Tela AMOLED de 6,8 polegadas a 120 Hz","12 GB RAM e 512 GB de armazenamento","Módulo de câmeras circular em acabamento preto"],{"isNew":true}],
    ["zenix-mini","Zenix Mini 5G","Compacto, conectado, seu",189990,"phone-mini-coral-hd.png",["Tela de 5,9 polegadas","6 GB RAM e 128 GB de armazenamento","Corpo compacto em coral com câmera única"]],
    ["zenix-fold","Zenix Fold 5G","Uma tela que se transforma",599990,"phone-fold-hd.png",["Tela interna dobrável de 7,6 polegadas","12 GB RAM e 256 GB de armazenamento","Modo de uso com duas janelas"]],
    ["zenix-fold-pro","Zenix Flip 5G","Compacto por fora, amplo por dentro",749990,"phone-flip-cream-hd.png",["Tela dobrável vertical de 6,7 polegadas","12 GB RAM e 512 GB de armazenamento","Tela externa e corpo em creme"],{"isNew":true}],
    ["zenix-vision","Zenix Vision 5G","Fotografe suas melhores ideias",279990,"phone-vision-lilac-hd.png",["Tela de 6,6 polegadas","8 GB RAM e 256 GB de armazenamento","Barra horizontal de câmeras e acabamento lilás"]],
    ["zenix-power","Zenix Power Rugged 5G","Energia com proteção extra",169990,"phone-power-rugged-hd.png",["Bateria de 7.000 mAh","8 GB RAM e 256 GB de armazenamento","Corpo reforçado com detalhes laranja"],{"previousPrice":199990}],
    ["zenix-studio","Zenix Studio 5G","Crie, edite e compartilhe",529990,"phone-studio-silver-hd.png",["Tela AMOLED de 6,7 polegadas","16 GB RAM e 1 TB de armazenamento","Caneta integrada ao corpo prateado"]]
  ]);
  extend('audio', [
    ["tuneflow-air","TuneFlow Air","Sua música em qualquer lugar",17990,"audio-air-white-hd.png",["Fones sem fio com hastes brancas","Até 24 horas com o estojo retangular","Controles por toque"]],
    ["tuneflow-mini","TuneFlow Mini","Som em formato compacto",12990,"audio-mini-lavender-hd.png",["Fones lavanda sem hastes","Até 18 horas com estojo oval","Microfone para chamadas"],{"previousPrice":15990}],
    ["tuneflow-max","TuneFlow Sport Max","Seu som acompanha o movimento",39990,"audio-sport-champagne-hd.png",["Ganchos esportivos para as orelhas","Até 36 horas com o estojo","Estojo em acabamento champanhe"],{"isNew":true}],
    ["novasound-studio","NovaSound Studio","Escute cada detalhe",49990,"headphones-hd.png",["Fone over-ear","Drivers de 40 mm","Até 40 horas de reprodução"]],
    ["novasound-travel","NovaSound Travel","Seu som também viaja",34990,"audio-travel-silver-hd.png",["Fone on-ear compacto prateado","Estrutura dobrável","Até 30 horas de bateria"],{"previousPrice":39990}],
    ["novasound-play","NovaSound Play","Conforto para longas sessões",27990,"audio-play-headset-hd.png",["Headset gamer com detalhes vermelhos","Modo de baixa latência","Microfone em haste ajustável"]],
    ["novabeat-pocket","NovaBeat Pocket","Leve sua música com você",14990,"speaker-hd.png",["Caixa Bluetooth de 10 W","Até 8 horas de reprodução","Corpo portátil"]],
    ["novabeat-pulse","NovaBeat Pulse","Mais presença no seu som",29990,"audio-pulse-boombox-hd.png",["Caixa Bluetooth de 20 W","Até 12 horas de reprodução","Corpo azul horizontal com alça"]],
    ["novabeat-party","NovaBeat Party","Seu encontro tem trilha sonora",59990,"audio-party-tower-hd.png",["Caixa Bluetooth de 40 W","Dois alto-falantes com anéis RGB","Gabinete vertical com alça integrada"],{"isNew":true}]
  ]);
  extend('wearables', [
    ["fitnova-square","FitNova Square","Conexões no seu pulso",29990,"watch-square-midnight-hd.png",["Tela AMOLED retangular de 1,8 polegada","Chamadas Bluetooth","Pulseira preta ajustável"]],
    ["fitnova-classic","FitNova Classic","Tecnologia com elegância",44990,"watch-round-classic-hd.png",["Mostrador redondo de 1,4 polegada","Caixa dourada e pulseira marrom","Notificações de mensagens"]],
    ["fitnova-rose","FitNova Rose","Seu ritmo, seu estilo",32990,"watch-square-rose-hd.png",["Tela retangular de 1,7 polegada","Acabamento rosé e pulseira rosa","Registro de atividades diárias"],{"previousPrice":37990}],
    ["fitnova-ultra","FitNova Ultra","Explore novos caminhos",69990,"watch-rugged-orange-hd.png",["GPS integrado","Caixa reforçada e pulseira laranja","Até 10 dias de bateria"],{"isNew":true}],
    ["fitnova-active","FitNova Active","Leveza em cada movimento",19990,"watch-fitness-teal-hd.png",["Tela compacta de 1,5 polegada","Pulseira verde-petróleo","Mais de 30 modos esportivos"]],
    ["fitnova-steel","FitNova Steel","Um clássico sempre conectado",54990,"watch-round-silver-hd.png",["Tela redonda AMOLED de 1,43 polegada","Pulseira metálica prateada","Chamadas Bluetooth"]],
    ["fitnova-trek","FitNova Trek","Pronto para sua próxima trilha",79990,"watch-round-titanium-hd.png",["GPS e bússola integrados","Caixa cinza e pulseira de tecido verde","Até 14 dias de bateria"]],
    ["fitnova-lite","FitNova Lite","Simples de usar todos os dias",24990,"watch-square-white-hd.png",["Tela de 1,75 polegada","Caixa prateada e pulseira branca","Notificações e controle de música"]],
    ["fitnova-kids","FitNova Kids","Diversão para pequenos exploradores",22990,"watch-kids-blue-hd.png",["Formato infantil com pulseira azul","Mostradores divertidos e alarmes","Contador de passos"],{"isNew":true}]
  ]);
  extend('smart-home', [
    ["smartbulb-color-4","NovaLight Fita RGB 5 m","Cor em cada detalhe da casa",12990,"home-led-strip-hd.png",["Fita LED RGB de 5 metros","Controle pelo aplicativo","Programação de cores e intensidade"],{"previousPrice":15990}],
    ["smartbulb-white","NovaLight Plafon Smart","Ilumine o ambiente inteiro",5990,"home-ceiling-light-hd.png",["Luminária de teto circular","Temperatura de branco ajustável","Programação de horários"]],
    ["novaplug-mini","NovaPlug Mini","Controle seus aparelhos",7990,"smart-plug-hd.png",["Tomada inteligente Wi-Fi","Padrão brasileiro de três pinos","Agendamento de liga e desliga"]],
    ["novaplug-energy","NovaPlug Régua Energy","Mais aparelhos, mais controle",11990,"home-power-strip-hd.png",["Quatro tomadas no padrão brasileiro","Duas portas USB","Controle Wi-Fi e medição de consumo"]],
    ["novacam-home","NovaCam Home","Sua casa mais próxima",19990,"smart-camera-hd.png",["Câmera interna Full HD","Visão noturna","Áudio bidirecional"]],
    ["novacam-home-pro","NovaCam Outdoor 2K","Uma visão do lado de fora",29990,"home-outdoor-camera-hd.png",["Câmera externa de formato tubular com resolução 2K","Visão noturna e detecção de movimento","Duas antenas e suporte para parede"],{"isNew":true}],
    ["novahome-display-7","NovaHome Display 7","Uma central para sua rotina",69990,"smart-display-hd.png",["Tela touch de 7 polegadas","Painel de dispositivos inteligentes","Alto-falante integrado"]],
    ["novahome-display-10","NovaHome Painel 10","Sua casa ao alcance de um toque",99990,"home-wall-panel-hd.png",["Tela touch de 10 polegadas para parede","Painel de controle de iluminação e dispositivos","Rotinas de automação"],{"isNew":true}],
    ["novahome-voice","NovaHome Voice","Sua casa responde ao seu ritmo",34990,"home-voice-sphere-hd.png",["Alto-falante inteligente Wi-Fi","Formato esférico com tecido branco","Controle de rotinas por voz"]]
  ]);
  extend('gaming', [
    ["novaplay-controller-pro","NovaPlay Controller Pro","Precisão em cada comando",29990,"game-controller-elite-hd.png",["Controle branco com analógicos assimétricos","Botões traseiros configuráveis","Até 20 horas de bateria"]],
    ["novaplay-controller-mini","NovaPlay Controller Retro","Um clássico para novas partidas",14990,"game-controller-retro-hd.png",["Corpo compacto em azul e creme","Direcional em cruz e botões coloridos","Conexão Bluetooth"]],
    ["novaplay-console-mini","NovaPlay Console Mini","Comece uma nova aventura",129990,"game-console-hd.png",["Console doméstico compacto","Armazenamento de 256 GB","Saída de vídeo Full HD"]],
    ["novaplay-console-one","NovaPlay Console Portátil","Sua próxima partida vai com você",249990,"game-handheld-hd.png",["Tela OLED de 7 polegadas","SSD de 512 GB","Controles integrados ao console"],{"previousPrice":279990}],
    ["novaplay-console-ultra","NovaPlay Console Ultra","Mais espaço para suas partidas",359990,"game-console-horizontal-hd.png",["Console horizontal com SSD de 1 TB","Conectividade Wi-Fi","Saída de vídeo 4K a 120 Hz"],{"isNew":true}],
    ["novaplay-mouse-speed","NovaPlay Mouse Speed","Movimentos rápidos e precisos",12990,"gaming-mouse-hd.png",["Sensor de até 8.000 DPI","Seis botões","Iluminação RGB"]],
    ["novaplay-mouse-precision","NovaPlay Mouse Ergo","Controle em um novo ângulo",19990,"game-mouse-vertical-hd.png",["Design vertical ergonômico","Sensor de até 16.000 DPI","Apoio para o polegar"]],
    ["novaplay-mouse-air","NovaPlay Mouse Air","Liberdade para jogar",24990,"game-mouse-honeycomb-hd.png",["Conexão sem fio de 2,4 GHz","Carcaça branca perfurada ultraleve","Até 50 horas de bateria"]],
    ["novaplay-keyboard-core","NovaPlay Mechanical RGB","Cada tecla entra na partida",17990,"game-keyboard-rgb-hd.png",["Teclado mecânico completo com bloco numérico","Iluminação RGB entre as teclas","Conexão USB"]]
  ]);
  extend('cameras', [
    ["novaaction-mini","NovaAction Mini","Compacta para grandes momentos",29990,"camera-mini-cube-hd.png",["Vídeo Full HD","Corpo branco em cubo ultracompacto","Lente grande-angular"]],
    ["novaaction-pro","NovaAction Modular Pro 4K","Mais possibilidades para filmar",69990,"camera-action-modular-hd.png",["Vídeo 4K a 60 quadros por segundo","Lente modular cilíndrica","Tela frontal ampla"],{"previousPrice":79990}],
    ["novaaction-adventure","NovaAction Adventure","Registre suas aventuras",89990,"camera-action-orange-hd.png",["Vídeo 4K","Corpo reforçado em laranja","Dois pequenos visores frontais"]],
    ["novavision-m1","NovaVision M1","Veja além do cotidiano",249990,"mirrorless-camera-hd.png",["Câmera mirrorless de 24 MP","Lente padrão intercambiável","Vídeo Full HD"]],
    ["novavision-studio","NovaVision Studio","Sua criatividade em foco",399990,"camera-studio-white-hd.png",["Sensor de 32 MP","Gravação de vídeo em 4K","Corpo e lente profissionais em branco"],{"isNew":true}],
    ["novavision-travel","NovaVision Travel","Uma companhia para suas viagens",299990,"camera-travel-retro-hd.png",["Sensor de 26 MP","Corpo compacto em prata e couro marrom","Lente retrátil"]],
    ["nova360-view","Nova360 View","Explore todos os ângulos",119990,"camera-360-hd.png",["Captura de vídeo em 360 graus","Resolução de 4K","Tela colorida"]],
    ["nova360-pro","Nova360 Pro","Mais detalhe em cada direção",199990,"camera-360-sphere-hd.png",["Vídeo em 360 graus com resolução 5,7K","Corpo esférico com duas lentes opostas","Base integrada"],{"isNew":true}],
    ["nova360-sport","Nova360 Sport","Movimento de todos os lados",159990,"camera-360-sport-hd.png",["Vídeo em 360 graus","Corpo horizontal reforçado em laranja","Duas lentes olho de peixe"]]
  ]);
  extend('accessories', [
    ["novapack-15","NovaPack Urban 15","Seu notebook vai com você",15990,"backpack-hd.png",["Mochila para notebook de até 15,6 polegadas","Compartimento acolchoado","Bolsos organizadores"]],
    ["novapack-17","NovaPack Travel 17","Organização para sua viagem",22990,"accessory-backpack-rolltop-hd.png",["Mochila para notebook de até 17,3 polegadas","Fechamento enrolável e capacidade de 28 litros","Lona bege e fivelas em couro"]],
    ["novadrive-2tb","NovaDrive Rugged SSD 2 TB","Seus arquivos com proteção extra",89990,"accessory-ssd-rugged-hd.png",["SSD portátil de 2 TB com conexão USB-C","Capa protetora laranja e alça integrada","Transferência de até 1.050 MB/s"],{"previousPrice":99990}],
    ["novakeys-pro","NovaKeys Ergo","Conforto em cada palavra",24990,"accessory-keyboard-ergonomic-hd.png",["Teclado ergonômico branco dividido","Apoio de pulso integrado","Conexão Bluetooth com até três dispositivos"]],
    ["novacharge-35","NovaCharge GaN 35 W","Energia em formato compacto",12990,"charger-gan-hd.png",["Potência de 35 W","Portas USB-C e USB-A","Plugue brasileiro"]],
    ["novacharge-65","NovaCharge Mesa 65 W","Uma central de recarga na sua mesa",21990,"accessory-charger-desktop-hd.png",["Carregador de mesa de até 65 W","Duas portas USB-C e uma USB-A","Corpo preto com cabo e plugue brasileiro"],{"isNew":true}],
    ["novahub-8","NovaHub USB-C 8 em 1","Mais conexões na sua mesa",27990,"hub-usbc-hd.png",["Hub com oito conexões","HDMI, USB e leitor de cartões","Corpo em alumínio"]]
  ]);
  const knownIds = new Set(products.map(p => p.id));
  const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const money = cents => moneyFormatter.format(cents / 100);

  function sanitizeCart(value) {
    const result = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
    for (const [id, quantity] of Object.entries(value)) {
      if (knownIds.has(id) && Number.isInteger(quantity) && quantity > 0) result[id] = Math.min(99, quantity);
    }
    return result;
  }
  function sanitizeFavorites(value) {
    return Array.isArray(value) ? [...new Set(value.filter(id => knownIds.has(id)))] : [];
  }
  function addItem(cart, id, quantity = 1) {
    const next = sanitizeCart(cart);
    if (knownIds.has(id) && Number.isInteger(quantity) && quantity > 0) next[id] = Math.min(99, (next[id] || 0) + quantity);
    return next;
  }
  function setQuantity(cart, id, quantity) {
    const next = sanitizeCart(cart);
    if (!knownIds.has(id) || !Number.isInteger(quantity)) return next;
    if (quantity <= 0) delete next[id];
    else next[id] = Math.min(99, quantity);
    return next;
  }
  function totals(cart) {
    const valid = sanitizeCart(cart);
    const subtotal = products.reduce((sum, p) => sum + p.price * (valid[p.id] || 0), 0);
    const quantity = Object.values(valid).reduce((sum, n) => sum + n, 0);
    const shipping = subtotal === 0 || subtotal >= 29900 ? 0 : 1990;
    return { subtotal, shipping, total: subtotal + shipping, quantity };
  }
  function filterProducts({ category = 'all', query = '', mode = 'featured', sort = 'relevance' } = {}) {
    const term = normalize(query);
    const result = products.filter(p =>
      (category === 'all' || p.category === category) &&
      (!term || normalize(`${p.name} ${p.subtitle} ${p.description} ${p.specs.join(' ')} ${categories[p.category]}`).includes(term)) &&
      (mode !== 'featured' || p.group === 'trending') &&
      (mode !== 'offers' || p.previousPrice > p.price) &&
      (mode !== 'new' || p.isNew)
    );
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return result;
  }
  const categoryCounts = Object.freeze(Object.fromEntries(Object.keys(categories).map(key => [key, key === 'all' ? products.length : products.filter(p => p.category === key).length])));
  const api = Object.freeze({ products: Object.freeze(products.map(p => Object.freeze({ ...p, specs: Object.freeze(p.specs) }))), categories: Object.freeze(categories), categoryCounts, money, normalize, sanitizeCart, sanitizeFavorites, addItem, setQuantity, totals, filterProducts });
  root.TechNovaCatalog = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
