import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorsComponent } from './components/errors/errors.component';
import { ShowRecipeComponent } from './components/show-recipe/show-recipe.component';
import { SavedRecipeComponent } from './components/saved-recipe/saved-recipe.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recipe/:id', component: ShowRecipeComponent },
  { path: 'saved-recipes', component: SavedRecipeComponent },
  { path: '**', component: ErrorsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
