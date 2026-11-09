export type ActivityCategory = 'doméstico' | 'água nos alimentos' | 'fabricação'

export type Measure = 'minuto' | 'segundo' | 'hora' | 'dia' | 'gramas' | 'quilos' | 'unidade'

export interface Activity {
  /** Identificador estável usado no formulário. */
  id: string
  acao: string
  /** Litros de água gastos na quantidade de referência (`unidade`). */
  gasto: number
  /** Quantidade de referência da medida. */
  unidade: number
  medida: Measure
  categoria: ActivityCategory
}

/**
 * Base de dados preservada do projeto original (2013/2014).
 * Apenas as atividades domésticas aparecem no formulário — era assim no iWater original.
 * As demais ficam disponíveis para referências e curiosidades.
 */
export const activities: Activity[] = [
  {
    id: 'lavar-as-maos',
    acao: 'Lavar as mãos',
    gasto: 12,
    unidade: 1,
    medida: 'minuto',
    categoria: 'doméstico',
  },
  {
    id: 'torneira-aberta',
    acao: 'Torneira aberta',
    gasto: 12,
    unidade: 1,
    medida: 'minuto',
    categoria: 'doméstico',
  },
  {
    id: 'torneira-pingando',
    acao: 'Torneira pingando',
    gasto: 20,
    unidade: 1,
    medida: 'minuto',
    categoria: 'doméstico',
  },
  {
    id: 'descarga',
    acao: 'Descarga',
    gasto: 6,
    unidade: 6,
    medida: 'segundo',
    categoria: 'doméstico',
  },
  {
    id: 'banho',
    acao: 'Banho',
    gasto: 90,
    unidade: 10,
    medida: 'minuto',
    categoria: 'doméstico',
  },
  {
    id: 'torneira-gotejando',
    acao: 'Torneira gotejando',
    gasto: 46,
    unidade: 1,
    medida: 'dia',
    categoria: 'doméstico',
  },
  {
    id: 'lavar-carro',
    acao: 'Lavar o carro com mangueira',
    gasto: 560,
    unidade: 30,
    medida: 'minuto',
    categoria: 'doméstico',
  },
  {
    id: 'lavar-louca',
    acao: 'Lavar louça com a torneira meio aberta',
    gasto: 110,
    unidade: 20,
    medida: 'minuto',
    categoria: 'doméstico',
  },
  {
    id: 'pao-frances',
    acao: 'Comer pão francês',
    gasto: 0.0175,
    unidade: 50,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'ovo',
    acao: 'Comer ovo',
    gasto: 0.0375,
    unidade: 50,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'carne-moida',
    acao: 'Comer carne bovina moída refogada',
    gasto: 0.065,
    unidade: 100,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'pao-de-forma',
    acao: 'Comer pão de forma',
    gasto: 0.01,
    unidade: 30,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'carne-bovina',
    acao: 'Comer carne bovina',
    gasto: 0.075,
    unidade: 150,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'peixe',
    acao: 'Comer peixe',
    gasto: 0.05,
    unidade: 100,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'alface',
    acao: 'Comer alface',
    gasto: 0.278,
    unidade: 300,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'melancia',
    acao: 'Comer melancia',
    gasto: 9200,
    unidade: 10,
    medida: 'quilos',
    categoria: 'água nos alimentos',
  },
  {
    id: 'cenoura',
    acao: 'Comer cenoura',
    gasto: 0.1584,
    unidade: 180,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'uva',
    acao: 'Comer uva (cacho)',
    gasto: 0.243,
    unidade: 300,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'laranja',
    acao: 'Comer laranja',
    gasto: 0.087,
    unidade: 100,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'abacaxi',
    acao: 'Comer abacaxi',
    gasto: 0.001125,
    unidade: 1.5,
    medida: 'quilos',
    categoria: 'água nos alimentos',
  },
  {
    id: 'banana',
    acao: 'Comer banana',
    gasto: 0.074,
    unidade: 100,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'peixe-assado',
    acao: 'Comer peixe (assado)',
    gasto: 0.074,
    unidade: 100,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'frango',
    acao: 'Comer frango assado (coxa)',
    gasto: 0.035,
    unidade: 50,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'pao-branco',
    acao: 'Comer pão branco',
    gasto: 0.0148,
    unidade: 40,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'manteiga',
    acao: 'Comer manteiga',
    gasto: 0.0368,
    unidade: 230,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'bolacha',
    acao: 'Comer bolacha água e sal',
    gasto: 0.001,
    unidade: 30,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'acucar',
    acao: 'Comer açúcar',
    gasto: 0.00016,
    unidade: 160,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'brocolis',
    acao: 'Comer brócolis',
    gasto: 0.238,
    unidade: 243,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'pera',
    acao: 'Comer pêra',
    gasto: 0.087,
    unidade: 100,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'arroz-branco',
    acao: 'Comer arroz branco',
    gasto: 0.0663,
    unidade: 85,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'arroz-integral',
    acao: 'Comer arroz integral',
    gasto: 0.0714,
    unidade: 85,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'feijao',
    acao: 'Comer feijão cozido',
    gasto: 0.0624,
    unidade: 80,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'maca',
    acao: 'Comer maçã com casca',
    gasto: 0.078,
    unidade: 100,
    medida: 'gramas',
    categoria: 'água nos alimentos',
  },
  {
    id: 'calca-jeans',
    acao: 'Comprar uma calça jeans',
    gasto: 15000,
    unidade: 1,
    medida: 'unidade',
    categoria: 'fabricação',
  },
  {
    id: 'camiseta',
    acao: 'Comprar camiseta de algodão',
    gasto: 3700,
    unidade: 1,
    medida: 'unidade',
    categoria: 'fabricação',
  },
]

export const domesticActivities = activities.filter(
  (activity) => activity.categoria === 'doméstico',
)

/** Fatos de pegada hídrica preservados da base original. */
export const footprintFacts = [
  {
    id: 'calca-jeans',
    label: 'uma calça jeans',
    liters: 15000,
  },
  {
    id: 'camiseta',
    label: 'uma camiseta de algodão',
    liters: 3700,
  },
  {
    id: 'carne',
    label: 'um quilo de carne bovina',
    liters: 15000,
  },
] as const
