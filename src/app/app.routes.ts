import { Routes } from '@angular/router';


export const routes: Routes = [
{
        path: 'register',
        loadComponent: () => import('./app/components/forms/forms.component')
      	.then(m => m.Forms)
    },

];
