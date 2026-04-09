declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "react-chartjs-2" {
  export const Bar: any;
  export const Scatter: any;
}

declare module "ml-knn" {
  export default class KNN {
    constructor(dataset: number[][], labels: any[], options?: { k?: number });
    predict(dataset: number[][]): any[];
  }
}

declare module "react-papaparse" {
  export const CSVReader: any;
}

declare module "messageformat" {
  export default class MessageFormat {
    constructor(locale: string);
    compile(message: string): (args?: Record<string, any>) => string;
  }
}
