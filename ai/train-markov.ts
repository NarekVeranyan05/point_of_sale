import { promises as fs } from 'fs';
import Papa from "papaparse";

const dict: Record<string, number> = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
    'i': 8,
    'j': 9,
}

export const trainMarkov = async () => {
    const T = Array.from({ length: 10 }, () => Array(10).fill(0));
    const transitionCounts = new Array<number>(10).fill(0);

    const trainData = await fs.readFile("./training.csv", 'utf-8');

    let p: {data: string[][]} = Papa.parse<string[]>(trainData, {
        header: false,
        skipEmptyLines: true
    });

    p.data.forEach(arr => {
        for(let i = 0; i < arr.length - 1; i++) {
            let currState = arr[i];
            let nextState = arr[i + 1];

            transitionCounts[ dict[currState] ] += 1;
            T[ dict[currState] ][ dict[nextState] ] += 1;
        }
    });

    const TCSV = Papa.unparse(T);
    const transitionCountsCSV = Papa.unparse([transitionCounts]);

    await fs.writeFile('./markov-model.csv', TCSV);
    await fs.appendFile('./markov-model.csv', '\n\n');
    await fs.appendFile('./markov-model.csv', transitionCountsCSV);
}

trainMarkov();