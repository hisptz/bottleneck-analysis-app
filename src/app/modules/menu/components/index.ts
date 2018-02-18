import { LoginFormComponent } from './login-form/login-form.component';
import { MenuSearchComponent } from './menu-search/menu-search.component';
import { MenuProfileComponent } from './menu-profile/menu-profile.component';
import { MenuLoaderComponent } from './menu-loader/menu-loader.component';
import {MenuSideBarComponent} from './menu-side-bar/menu-side-bar.component';
export const components: any[] = [
  MenuLoaderComponent,
  MenuProfileComponent,
  MenuSearchComponent,
  LoginFormComponent,
  MenuSideBarComponent
];

export * from './menu-search/menu-search.component';
export * from './menu-profile/menu-profile.component';
export * from './menu-loader/menu-loader.component';
export * from './login-form/login-form.component';
export * from './menu-side-bar/menu-side-bar.component';
