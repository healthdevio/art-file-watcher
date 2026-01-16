export type LineCNAB240 = {
  line: string;
};

export type HeaderCNAB240 = {
  file: string;
};

export type CNAB240 = {
  header: HeaderCNAB240;
  lines: LineCNAB240[];
};
