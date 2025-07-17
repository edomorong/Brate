export type SubmenuItem = {
  label: string;
  href: string;
};

export type HeaderItem = {
  label: string;
  href?: string; // puede venir o no
  subItems?: SubmenuItem[]; // puede venir o no
  external?: boolean;
  target?: string;
};
