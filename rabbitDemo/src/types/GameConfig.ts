import type { Ref } from "vue";
interface GameEvents {
  clickCallback?: () => void;
  dropCallback?: () => void;
  winCallback?: () => void;
  loseCallback?: () => void;
}

export interface GameConfig {
  container?: Ref<HTMLElement | undefined>; // cardNode容器
  cardNum: number; // card类型数量
  layerNum: number; // card层数
  trap?: boolean; //  是否开启陷阱
  delNode?: boolean; //  是否从nodes中剔除已选节点
  events?: GameEvents; //  游戏事件
}
