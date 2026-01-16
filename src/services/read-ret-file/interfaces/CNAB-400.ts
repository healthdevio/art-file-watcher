export type LineCNAB400 = {
  line: string;
};

export type HeaderCNAB400 = {
  file: string;
};

export type CNAB400 = {
  header: HeaderCNAB400;
  lines: LineCNAB400[];
};
