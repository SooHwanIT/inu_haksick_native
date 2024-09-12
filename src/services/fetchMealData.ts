import axios from 'axios';
import * as cheerio from 'cheerio';

// Define an interface for meal information
interface MealInfo {
    date: string;
    type: string;
    menu: string;
}

// Function to fetch meal data from a URL
export async function fetchMealData(url: string): Promise<MealInfo[]> {
    try {
        // Fetch the HTML content from the URL
        const { data } = await axios.get(url);

        // Parse the HTML using Cheerio
        const $ = cheerio.load(data);

        // Array to store meal information
        const mealList: MealInfo[] = [];

        // Loop through each day and extract the meal data
        $('.wrap-week').each((index, element) => {
            const date = $(element).find('.date').text().trim(); // Extract date

            // Loop through each meal type (breakfast, lunch, dinner, etc.)
            $(element).find('table tbody tr').each((_, row) => {
                const type = $(row).find('th').text().trim(); // Extract meal type
                const menu = $(row).find('td').text().trim(); // Extract meal menu

                // Add the meal data to the list if both type and menu are present
                if (type && menu) {
                    mealList.push({ date, type, menu });
                }
            });
        });

        // Return the list of meal data
        console.log(mealList)
        return mealList;
    } catch (error) {
        console.error('Error fetching meal data:', error);
        return [];
    }
}
