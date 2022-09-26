import type { GameConfig } from "./../types/GameConfig";
import { ref } from "vue";
import type { CardNode } from "../types/cardType";
import { shuffle, ceil, random, floor } from "lodash-es";
const defaultGameConfig: GameConfig = {
  cardNum: 4,
  layerNum: 2,
  delNode: false,
};

export default (config: GameConfig) => {
  const {
    container,
    cardNum,
    layerNum,
    delNode,
    events = {},
  } = { ...defaultGameConfig, ...config };
  const indexSet = new Set();
  const nodes = ref<CardNode[]>([]);
  let perFloorNodes: CardNode[] = [];
  const size = 40;
  //生成节点池
  const itemTypes = new Array(cardNum).fill(0).map((_, index) => index + 1);
  let itemList: number[] = [];
  const selectedNodes = ref<CardNode[]>([]);
  for (let i = 0; i < 3 * layerNum; i++) itemList = [...itemList, ...itemTypes];

  // 打乱节点
  itemList = shuffle(shuffle(itemList));

  // 初始化各个层级节点
  let len = 0; //总共的数量
  let floorIndex = 1;
  const floorList: number[][] = [];
  const itemLength = itemList.length;
  while (len <= itemLength) {
    const maxFloorNum = floorIndex * floorIndex;
    const floorNum = ceil(random(maxFloorNum / 2, maxFloorNum));
    floorList.push(itemList.splice(0, floorNum));
    len += floorNum;
    floorIndex++;
  }
  const containerWidth = container!.value!.clientWidth;
  const containerHeight = container!.value!.clientHeight;
  const width = containerWidth / 2;
  const height = containerHeight / 2 - 60;
  floorList.forEach((o, index) => {
    indexSet.clear();
    let i = 0;
    const floorNodes: CardNode[] = [];
    o.forEach((k) => {
      i = floor(random(0, (index + 1) ** 2));
      while (indexSet.has(i)) i = floor(random(0, (index + 1) ** 2));
      const row = floor(i / (index + 1));
      const column = index ? i % index : 0;
      const node: CardNode = {
        id: `${index}-${i}`,
        type: k,
        zIndex: index,
        index: i,
        row,
        column,
        top: height + (size * row - (size / 2) * index),
        left: width + (size * column - (size / 2) * index),
        parents: [],
        state: 0,
      };
      const xy = [node.top, node.left];
      perFloorNodes.forEach((e) => {
        if (Math.abs(e.top - xy[0]) <= size && Math.abs(e.left - xy[1]) <= size)
          e.parents.push(node);
      });
      floorNodes.push(node);
      indexSet.add(i);
    });
    nodes.value = nodes.value.concat(floorNodes);
    perFloorNodes = floorNodes;
  });
};
