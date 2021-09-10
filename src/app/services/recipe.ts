export interface Recipe {
    
    uri: string;
    label: string;
    image: string;
    source: string;
    url: string;
    shareAs: string;
    yield: number;
    dietLabels: string[];
    healthLabels: string[];
    cautions: string[];
    ingredientLines: string[];
    ingredients: Ingredient[];
    instructions: string[];
    calories: number;
    totalWeight: number;
    totalTime: number;
    cuisineType: string[];
    mealType: string[];
    dishType: string[];
    totalNutrients: { [key: string]: Total };
    totalDaily: { [key: string]: Total };
    digest: Digest[];
}

interface Digest {
    label: string;
    tag: string;
    schemaOrgTag: null | string;
    total: number;
    hasRDI: boolean;
    daily: number;
    unit: Unit;
    sub?: Digest[];
}

enum Unit {
    Empty = "%",
    G = "g",
    Kcal = "kcal",
    Mg = "mg",
    Μg = "µg",
}

interface Ingredient {
    text: string;
    weight: number;
    foodCategory: string;
    foodId: string;
    image: string;
}

export interface Total {
    label: string;
    quantity: number;
    unit: Unit;
}
