// Extensões de arquivos que devem ser IGNORADOS (blacklist)
// Arquivos com essas extensões não serão processados
export const CNAB_BLACKLIST_EXTENSIONS = ['.json', '.log', '.txt'];

// Filtro de tipo de arquivo para processar
// Valores possíveis: 'CNAB400' | 'CNAB240' | 'ALL'
// Altere apenas esta linha para mudar o filtro
export const FILE_TYPE_FILTER: 'CNAB400' | 'CNAB240' | 'ALL' = 'ALL';

type SaveLogFilter = { creditDate?: string | string[]; regional?: string | string[]; bankCode?: string | string[]; }
export const saveLogFilters: SaveLogFilter[] = [
  // { creditDate: '2026-01-02', regional: 'PR' },
  // { creditDate: '2026-01-02', regional: 'BA' },
  // { creditDate: '2026-01-15', regional: 'PR' },
  // { creditDate: '2026-01-15', regional: 'BA' },
  // { regional: ['BA', 'PR'] }, 
  {
    bankCode: ['001', '104'],
    regional: [
      'MS',
      'BA',
      'PR',
      'ES',
      'AC',
      'AL',
      'AM',
      'AP',
      'DF',
      'CE',
      'ES',
      'GO',
      'MA',
      'MG',
      'MT',
      'RN',
      'PB',
      'PE',
      'PI',
      'PR',
      'RJ',
      'RO',
      'RR',
      'TO',
      'CE',
      'MA',
      'RN',
      'SE'
    ]
  },
]

export const agreementToRegional = [
  { agreement: '73356', regional: 'MS' },
  { agreement: '073356', regional: 'MS', bankCode: '104', mode: '4parts' }, //
  { agreement: '234757', regional: 'BA', bankCode: '104' }, //
  { agreement: '081294', regional: 'PR', bankCode: '104', mode: '4parts' }, //
  { agreement: '81294', regional: 'PR' },
  { agreement: '052996', regional: 'ES', bankCode: '104', mode: '4parts' }, //
  { agreement: '52996', regional: 'ES' },
  { agreement: '2835965', regional: 'AC', bankCode: '001' }, //
  { agreement: '2835375', regional: 'AL', bankCode: '001' }, //
  { agreement: '2909128', regional: 'AM', bankCode: '001' }, //
  { agreement: '2828039', regional: 'AP', bankCode: '001' }, //
  { agreement: '2848659', regional: 'DF', bankCode: '001' }, //
  { agreement: '3726559', regional: 'CE', bankCode: '001' }, //
  { agreement: '3632840', regional: 'ES', bankCode: '001' }, //
  { agreement: '2832069', regional: 'GO', bankCode: '001', mode: '4parts' }, //
  { agreement: '3711056', regional: 'MA', bankCode: '001' }, //
  { agreement: '2832133', regional: 'MG', bankCode: '001', mode: '4parts' }, //
  { agreement: '3704138', regional: 'MT', bankCode: '001' }, //
  { agreement: '3643071', regional: 'RN', bankCode: '001' }, //
  { agreement: '3402948', regional: 'PB', bankCode: '001' }, //
  { agreement: '2810159', regional: 'PE', bankCode: '001' }, //
  { agreement: '2810627', regional: 'PI', bankCode: '001' }, //
  { agreement: '3650623', regional: 'PR', bankCode: '001', mode: '4parts' }, //
  { agreement: '2807857', regional: 'RJ', bankCode: '001', mode: '4parts' }, //
  { agreement: '3618432', regional: 'RO', bankCode: '001' }, //
  { agreement: '3556968', regional: 'RR', bankCode: '001' }, //
  { agreement: '3398378', regional: 'TO', bankCode: '001' }, //
  { agreement: '3085950', regional: 'MS', bankCode: '001', mode: '4parts' },
  { agreement: '054743', regional: 'CE' },
  { agreement: '052261', regional: 'MA' },
  { agreement: '220180', regional: 'RN' },
  { agreement: '051316', regional: 'SE' },
  { agreement: '081298', regional: '' },
  { agreement: '082036', regional: '' },
  { agreement: '051159', regional: '' },
  { agreement: '054067', regional: '' },
  { agreement: '051367', regional: '' },
  { agreement: '076882', regional: '' },
  { agreement: '2803079', regional: '' },
  { agreement: '220172', regional: '' },
  { agreement: '3751520', regional: '' },
  { agreement: '3751521', regional: '' },
  { agreement: '3751530', regional: '' },
  { agreement: '3751535', regional: '' },
  { agreement: '3751542', regional: '' },
  { agreement: '3751538', regional: '' },
  { agreement: '3751544', regional: '' },
  { agreement: '3751546', regional: '' },
  { agreement: '3751547', regional: '' },
  { agreement: '3751550', regional: '' },
  { agreement: '3751549', regional: '' },
  { agreement: '3751551', regional: '' },
  { agreement: '3751552', regional: '' },
  { agreement: '3751554', regional: '' },
  { agreement: '3751557', regional: '' },
  { agreement: '3751558', regional: '' },
  { agreement: '3751563', regional: '' },
  { agreement: '3751562', regional: '' },
  { agreement: '2808666', regional: '' },
  { agreement: '2811856', regional: '' },
  { agreement: '2812778', regional: '' },
  { agreement: '2812861', regional: '' },
  { agreement: '2814902', regional: '' },
  { agreement: '2820878', regional: '' },
  { agreement: '2822201', regional: '' },
  { agreement: '2826443', regional: '' },
  { agreement: '2891862', regional: '' },
  { agreement: '052358', regional: '' },
  { agreement: '051317', regional: '' },
  { agreement: '054074', regional: '' },
  { agreement: '219695', regional: '' },
  { agreement: '081052', regional: '' },
  { agreement: '052360', regional: '' },
]