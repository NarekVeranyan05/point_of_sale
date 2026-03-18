import db from "../assets/connection.ts";

export class Measurements {
    static units: Map<string, string>;

    static async fetchMeasures() {
        Measurements.units = new Map<string, string>();

        let results = await db().query<{
            type: string;
            measurement_unit: string;
        }>(
            "SELECT type, measurement_unit FROM product_master"
        );

        results.rows.forEach(row => {
            Measurements.units.set(row.type, row.measurement_unit);
        });
        console.log(results);

        console.log(Measurements.units)
    }
}