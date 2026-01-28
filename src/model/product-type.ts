const ProductType = {
    TRACK_SUIT: "TRACK_SUIT",
    RUNNING_SHOES: "RUNNING_SHOES",
};

type ProductType = typeof ProductType[keyof typeof ProductType];

export { ProductType };