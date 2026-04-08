import Papa from "papaparse";
import seedrandom from 'seedrandom';
import Product from "../src/model/product/product.ts";

const products = [
    "Gary's Tracks",
    "The Gopnik",
    "Greta's Runners",
    "Seeds of Doubt",
    "The Harevan",
    "The Hopar",
    "Dad's Slippers",
    "Lada Station Slippers",
    "Ararat Slippers",
    "Tatik's Pickled Everything"
];

export const suggestProduct = async (initProductName: string, totalAmount: number) => {
    if(totalAmount < 0)
        throw new NegativeTotalAmountError();

    let productsMaster = await Product.fetchInventory();

    let res = await fetch(new URL("./markov-model.csv", import.meta.url));
    let model = await res.text();
    let parsed: {data: number[][]} = Papa.parse(model, {
        skipEmptyLines: true,
        newline: "\n"
    });

    const T = parsed.data.slice(0, -1);
    const transitionCounts = parsed.data[parsed.data.length - 1];
    let currStateIndex = products.findIndex(p => p === initProductName);
    const generator = seedrandom("4290384ur8    fh[80cn1dsnka");
    let generatedProducts = [];

    while(totalAmount > 0 ) {
        let rand = 1 + generator() * (transitionCounts[currStateIndex] - 1);
        let numeratorSum = 0;

        let nextStateIndex = 0;
        while(numeratorSum < rand) {
            numeratorSum += Number(T[currStateIndex][nextStateIndex]);

            nextStateIndex++;
        }

        currStateIndex = nextStateIndex;
        let toAdd = productsMaster.find(p => p.name === products[currStateIndex])!.clone();

        if(toAdd.price > totalAmount) {
            totalAmount = 0;
        }
        else {
            generatedProducts.push(toAdd);
            totalAmount -= toAdd.price;
        }
    }

    return generatedProducts;
}

export class NegativeTotalAmountError extends Error {}