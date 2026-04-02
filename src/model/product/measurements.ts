import db from "../assets/connection.ts";

/**
 * Measurements stores all the units of measurement of the Products
 */
export class Measurements {
    static units: Map<string, string>;

    /**
     * Fetches the Product measurement units
     */
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
    }
}