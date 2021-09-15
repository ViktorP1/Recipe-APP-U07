import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/services/recipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Input() search :  string;
  @Input() dishType: Array<string>;
  @Input() health: Array<string>;
  recipes: Recipe[] = [];                       
  private subscriptions = new Subscription();   

  constructor(private recipeService: RecipeService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.search) {                   
      this.getRecipes(this.search, 50);
    }
    else {
      this.getMealRecommendations();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {  
    if (this.search || this.dishType && this.dishType.length || this.health && this.health.length) {
      this.getRecipes(this.search, 50)
    }
    else {
      this.getMealRecommendations();
    }
  }

  getRecipes(query: string, max: number, mealType: string[] = null): void {
    this.subscriptions.add(this.recipeService.getRecipes(query, this.dishType, this.health, mealType, max)
      .subscribe(res => {
        this.recipes = res;
      }));
  }

  getMealRecommendations(): void {
    const currentHour = parseInt(new Date().toLocaleTimeString('sv-se').substr(0, 2));
    let mealType: Array<string>;


    switch (true) {
      case (currentHour <= 10 && currentHour >= 6):
        mealType = ['breakfast'];
        break;
      case (currentHour <= 13 && currentHour >= 11):
        mealType = ['lunch'];
        break;
      case (currentHour <= 21 && currentHour >= 17):
        mealType = ['dinner'];
        break;
      default:
        mealType = ['snack'];
        break;
    }

    this.getRecipes(mealType[0], 50, mealType);
  }

  saveRecipe(recipe: Recipe): void {
    this.recipeService.saveRecipe(recipe);

    this.snackBar.open('Recipe is saved', 'Close', {
      duration: 2000
    });
  }

  removeRecipe(recipe: Recipe): void {
    this.recipeService.removeRecipe(recipe);

    this.snackBar.open('Recipe removed', 'Close', {
      duration: 2000
    });
  }

  recipeSaved(id: string): Boolean {
    return this.recipeService.recipeSaved(id);
  }

  getRecipeId(recipe: Recipe): string {
    return this.recipeService.getRecipeId(recipe);
  }
}