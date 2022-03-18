export interface PaletteInterface {
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;

  secondary100: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  secondary500: string;

  error100: string;
  error200: string;
  error300: string;
  error400: string;
  error500: string;

  background50: string;
  background100: string;
  background200: string;
  background300: string;
  background400: string;
  background500: string;
  background600: string;
  background700: string;

  overlay01: string;
  overlay02: string;

  information: string;
  highlight: string;
  transparent: 'transparent';

  onBackgroundLight01: string;
  onBackgroundLight02: string;
  onBackgroundLight03: string;
  onBackgroundLight04: string;

  onBackgroundDark01: string;
  onBackgroundDark02: string;
  onBackgroundDark03: string;
  onBackgroundDark04: string;
}

const Palette: PaletteInterface = {
  primary100: '#DBD1FF',
  primary200: '#C2A9FA',
  primary300: '#742DDD',
  primary400: '#6211C8',
  primary500: '#491389',

  secondary100: '#A8E2AB',
  secondary200: '#69C085',
  secondary300: '#259C72',
  secondary400: '#027D69',
  secondary500: '#066858',

  error100: '#FDAAAA',
  error200: '#F66161',
  error300: '#DE360B',
  error400: '#BF0711',
  error500: '#9D091E',

  background50: '#FFFFFF',
  background100: '#EEEEEE',
  background200: '#E0E0E0',
  background300: '#BDBDBD',
  background400: '#393939',
  background500: '#2C2C2C',
  background600: '#161616',
  background700: '#000000',

  overlay01: 'rgba(0,0,0,0.55)',
  overlay02: 'rgba(0,0,0,0.32)',

  information: '#ADC9FF',
  highlight: '#FFF2B6',
  transparent: 'transparent',

  onBackgroundLight01: 'rgba(0,0,0,0.88)',
  onBackgroundLight02: 'rgba(0,0,0,0.50)',
  onBackgroundLight03: 'rgba(0,0,0,0.38)',
  onBackgroundLight04: 'rgba(0,0,0,0.12)',

  onBackgroundDark01: 'rgba(255,255,255,0.88)',
  onBackgroundDark02: 'rgba(255,255,255,0.50)',
  onBackgroundDark03: 'rgba(255,255,255,0.38)',
  onBackgroundDark04: 'rgba(255,255,255,0.12)',
};

export default Palette;
