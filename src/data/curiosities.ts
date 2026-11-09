export interface CuriosityCategory {
  key: string
  label: string
  description: string
}

export const curiosityCategories: CuriosityCategory[] = [
  {
    key: 'industria',
    label: 'Indústria',
    description: 'A água escondida nos alimentos e nos produtos.',
  },
  {
    key: 'mundo',
    label: 'Mundo',
    description: 'A água no planeta, nos oceanos e na vida de todos.',
  },
  {
    key: 'domestico',
    label: 'Em casa',
    description: 'Pequenos hábitos que mudam o consumo no dia a dia.',
  },
  {
    key: 'historia',
    label: 'História',
    description: 'Como diferentes civilizações lidaram com a água.',
  },
]

export const curiosities: Record<string, string[]> = {
  mundo: [
    '97% da água do planeta é água do mar. Assim, apenas 3% da água existente na Terra é doce, e a maior parte está congelada.',
    'Se a água dos oceanos evaporasse, a quantidade de sal retida seria suficiente para cobrir os continentes, numa camada com cerca de 1,5 metro de espessura.',
    'Uma molécula de água permanece no oceano durante 98 anos, faz parte do gelo durante 20 meses, fica nos lagos e rios por 2 semanas e não dura na atmosfera por mais de 7 dias.',
    'O Brasil tem 13,7% de toda a água doce do planeta, sendo que 80% desse total está na Bacia Amazônica.',
    'Uma pessoa pode sobreviver um mês sem se alimentar, mas só sete dias sem beber água.',
    'De toda a água utilizada no mundo, 10% vai para o consumo humano, 20% é para uso industrial e 70% é usada na agricultura.',
    'Os mares e oceanos são responsáveis pela produção de 90% do oxigênio existente na atmosfera.',
    'Os oceanos contêm mais de 1.300.000.000 km³ de água.',
    '1,1 bilhão de pessoas em todo o mundo vivem sem água potável.',
    'Para cada tonelada de papel virgem, doze árvores são derrubadas.',
    'Segundo a ONU, cada pessoa necessita de cerca de 120 litros de água por dia para atender às necessidades de consumo e higiene.',
    'No Brasil, estima-se que cada pessoa consome 200 litros de água por dia. Quase o dobro do recomendado pela ONU.',
    'Mais de um bilhão de pessoas não dispõem de água salubre e 25 mil entre elas morrem diariamente devido à má qualidade das águas que usam e tomam.',
    'Na Europa, 41 milhões de pessoas carecem de acesso à água potável, enquanto 85 milhões não têm acesso ao saneamento básico.',
    'Metade dos leitos hospitalares é ocupada por doenças causadas pelo uso de água imprópria.',
    'Cerca de 2,6 bilhões de pessoas não têm instalações básicas de saneamento, a maioria vivendo na África e na Ásia.',
    'A Turquia enfrenta a Síria e o Iraque por seu projeto de construir represas e centrais hidrelétricas nas nascentes dos rios Tigre e Eufrates.',
    'Na África, 75% da população depende dos recursos hídricos subterrâneos, que representam apenas 15% dos recursos renováveis.',
    'A cada ano, 2 milhões de pessoas morrem por causa de doenças relacionadas à falta de saneamento.',
    'Na Bolívia, cerca de uma entre 10 crianças morre antes de completar 5 anos. A maioria dessas mortes está relacionada a doenças causadas por falta de água potável.',
  ],
  domestico: [
    'Da água que gastamos em nossas casas, cerca de 75% é usada no banheiro.',
    'Uma torneira mal fechada pode chegar a desperdiçar mais de 50 litros por dia, o que corresponde a mais de um metro cúbico por mês.',
    'As descargas dos aviões usam um sistema de sucção a vácuo, capaz de economizar 80% de água em relação às tradicionais.',
    'Quem opta por uma ducha gasta até 3 vezes mais do que quem usa um chuveiro convencional. São gastos, em média, 30 litros a cada cinco minutos de banho.',
    'A simples descarga de um vaso sanitário pode gastar até 30 litros de água, dependendo da tecnologia adotada.',
    'Reduzindo 1 minuto do seu banho, você pode economizar até 12 litros de água.',
    'Usar a mangueira como “vassoura” durante 15 minutos pode desperdiçar cerca de 280 litros de água.',
    'Para remover o gosto de cloro da água da torneira, basta deixar essa água em um recipiente aberto durante a noite.',
    'Lavar o carro com uma mangueira durante 10 minutos gasta, em média, 190 litros de água.',
  ],
  industria: [
    'São necessários 450 litros de água para produzir um ovo de galinha.',
    'São necessários 7.000 litros para refinar um barril de petróleo e 148.000 litros para fabricar um automóvel.',
    'Um quilo de couro para produzir roupas e artefatos, como bolsas e sapatos, gasta nada menos do que 16,6 mil litros de água.',
    'Sabe a calça jeans do dia a dia? Para uma simples calça ser feita, são gastos 15 mil litros de água no processo — unindo tingimento, corte e produção do tecido.',
    'Uma camiseta de algodão, por mais simples que pareça, gasta quase 4 mil litros de água para ser produzida.',
    'Cada litro de gasolina necessita de 10 litros de água para ser produzido antes de ser utilizado como combustível.',
    'Apenas um quilo de carne bovina gasta 15 mil litros de água. Já a carne de porco gasta menos: são 1,9 mil litros para cada quilo.',
    'O açúcar gasta água para sua produção e refinamento: são 1,5 mil litros de água para cada quilo de açúcar.',
    'Em termos globais, a indústria é responsável por 22% de toda a água doce consumida. Essa porcentagem é muito maior em países ricos — 59% — e bem menor nos países pobres — apenas 8%.',
    'O gasto de água necessário para produzir uma xícara de café, em torno de 140 litros, é equivalente a encher uma banheira.',
  ],
  historia: [
    'Na América, os incas e outras civilizações antigas já construíam numerosos sistemas de canalização de água para irrigação, principalmente nas terras áridas da costa do Peru.',
    'Os egípcios dominavam técnicas sofisticadas de irrigação do solo na agricultura e métodos de armazenamento de líquido, pois dependiam das enchentes do Rio Nilo.',
    'Os romanos se destacaram na construção de redes de esgotos e de canalizações para escoamento das águas de chuvas na cidade.',
    'Por volta do ano 300 d.C., existiam em Roma mais de 300 banhos públicos ou termas. Consumiam-se cerca de 3 milhões de litros de água por dia.',
    'Nas residências da Antiguidade, era comum as pessoas evacuarem diretamente no solo. A camada mais rica da população usava recipientes para fazer suas necessidades e, em seguida, descarregava o conteúdo em local próximo às moradias.',
    'Para tornar a água limpa antes de ser utilizada nas atividades domésticas, certos povos, principalmente os egípcios e japoneses, filtravam o líquido em vasos de porcelana.',
    'O Brasil foi um dos primeiros países do mundo a implantar redes de coleta para escoamento das águas das chuvas.',
    'Em cinquenta anos, de 1953 até 2003, vivemos 1.831 conflitos por água: 1.228 foram resolvidos por acordos e tratados, mas 37 chegaram à violência e, desses, 21 não escaparam à guerra.',
  ],
}

export const allCuriosities = Object.values(curiosities).flat()
