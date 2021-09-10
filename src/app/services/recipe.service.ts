import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Recipe } from './recipe';
import { environment } from 'src/environments/environment.prod';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {        //The recipe service handles api calls and contains methods related to recipes

  //API settings is stored in an environment file
  private app_id = environment.app_id;
  private app_key = environment.app_key;
  private api_url = environment.api_url;
  private api_auth = "&app_id=" + this.app_id + "&app_key=" + this.app_key;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  //Uses the http client for making an api call with parameters
  getRecipes(query: string, dishType: Array<string> = null, health: Array<string> = null, mealType: Array<string> = null, max: number = 100): Observable<Recipe[]> {
    return this.http.get<any>(this.api_url + query + this.api_auth + "&to=" + max + (dishType && dishType.length ? "&dishType=" + dishType.join("&dishType=") : "") +
     (health && health.length ? "&health=" + health.join("&health=") : "") + (mealType && mealType.length ? "&mealType=" + mealType.join("&mealType=") : "")).pipe(
      map(res => res.hits.map(res => res.recipe))
    ).pipe(
      retry(3) && catchError(this.handleError)      //Retry 3 times in case of an error and uses a separate method for handling the error
    );
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<any>(this.api_url + id + this.api_auth).pipe(
      map(res => res.hits.map(res => res.recipe))
    ).pipe(
      retry(3) && catchError(this.handleError)
    );
  }

  getSavedRecipe(id: string): Recipe {
    return JSON.parse(localStorage.getItem(id));
  }

  saveRecipe(recipe: Recipe): void {
    localStorage.setItem(this.getRecipeId(recipe), JSON.stringify(recipe));
  }

  removeRecipe(recipe: Recipe): void {
    localStorage.removeItem(this.getRecipeId(recipe));
  }

  recipeSaved(id: string): boolean {
    return (localStorage.getItem(id) ? true : false);
  }

  getRecipeId(recipe: Recipe): string {
    return recipe?.uri.substr(recipe.uri.indexOf('#') + 8, recipe.uri.length); 
  }

  addRecipeInstruction(text: string, recipe: Recipe): void {
    if (!recipe.instructions) {        
      recipe.instructions = [];
    }

    recipe.instructions.push(text);
    this.saveRecipe(recipe);
  }


  private handleError(error: HttpErrorResponse): Observable<HttpErrorResponse> {
    return throwError(alert('An error occured, please try again.'));
  }
}