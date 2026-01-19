export type MenuLink = {
  label: string;
  icon: string;
  to: string;
};

export const MENU_LINKS: MenuLink[] = [
  { label: 'Início', icon: '🏠', to: '/home' },
  { label: 'Serviços', icon: '✂️', to: '/barber-products' },
  { label: 'clientes', icon: '👥', to: '/clientes' },
  { label: 'Agendamentos', icon: '📅', to: '/appointments/list' },
  { label: 'Horários', icon: '⏰', to: 'appointments/create' },
   
];


