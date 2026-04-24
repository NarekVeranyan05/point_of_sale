import Papa from "papaparse";
import seedrandom from 'seedrandom';
import Product from "../../product/product.ts";

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

/**
 * The MarkovModel class is a Markov chain for generating Products
 */
export default class MarkovModel {
    static #generator = seedrandom("4290384ur8    fh[80cn1dsnka");
    static #instance: MarkovModel;

    #adjacencyMatrix;
    #transitionCounts;

    /**
     * Getting MarkovModel singleton
     */
    static async getInstance(): Promise<MarkovModel> {
        if(this.#instance == undefined) {
            this.#instance = new MarkovModel();

            let res = await fetch(new URL("./markov-model.csv", import.meta.url));
            let model = await res.text();
            let parsed: {data: number[][]} = Papa.parse(model, {
                skipEmptyLines: true,
                newline: "\n"
            });

            this.#instance.#adjacencyMatrix =  parsed.data.slice(0, -1);
            this.#instance.#transitionCounts = parsed.data[parsed.data.length - 1];
        }

        return this.#instance;
    }

    private constructor() {
        this.#adjacencyMatrix = new Array<number[]>();
        this.#transitionCounts = new Array<number>();
    }

    /**
     * Generating products based on given setup
     * @param initProductName the initial product name to begin with
     * @param terminationAmount the total amount not to be exceeded
     */
    async generateOutputs(initProductName: string, terminationAmount: number): Promise<Product[]> {
        let productsMaster = await Product.fetchInventory();
        let currStateIndex = products.findIndex(p => p === initProductName);

        let generatedProducts = [];
        while(terminationAmount > 0 ) {
            let rand = 1 + MarkovModel.#generator() * (this.#transitionCounts[currStateIndex] - 1);
            let numeratorSum = 0;

            let nextStateIndex = 0;
            while(numeratorSum < rand) {
                numeratorSum += Number(this.#adjacencyMatrix[currStateIndex][nextStateIndex]);

                nextStateIndex++;
            }

            currStateIndex = nextStateIndex;
            let toAdd = productsMaster.find(p => p.name === products[currStateIndex])!.clone();

            if(toAdd.price > terminationAmount) {
                terminationAmount = 0;
            }
            else {
                generatedProducts.push(toAdd);
                terminationAmount -= toAdd.price;
            }
        }

        return generatedProducts;
    }
}