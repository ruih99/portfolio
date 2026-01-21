declare module "react-matrix-animation" {
  import { ComponentType } from "react";

  export interface MatrixAnimationProps {
    /** 表示する文字のセット */
    tileSet?: string[];
    /** 文字の色 (CSSカラー値) */
    fontColor?: string;
    /** 背景色 (CSSカラー値、透明も可) */
    backgroundColor?: string;
  }

  export const ReactMatrixAnimation: ComponentType<MatrixAnimationProps>;
}
