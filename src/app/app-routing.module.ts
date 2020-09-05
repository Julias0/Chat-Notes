import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'notes',
    loadChildren: () => import('./notes/notes.module').then(m => m.NotesPageModule)
  },
  {
    path: 'favourites',
    loadChildren: () => import('./favourites/favourites.module').then(m => m.FavouritesPageModule)
  },
  {
    path: 'deleted',
    loadChildren: () => import('./deleted/deleted.module').then(m => m.DeletedPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
