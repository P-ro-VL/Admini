export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiHeader {
  key: string;
  value: string;
}

export interface ApiConfig {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: ApiHeader[];
  body?: string; // JSON string template
  isAuth?: boolean;
  tokenPath?: string; // Path to token in response (e.g., "data.token")
}

export type ComponentType = 'table' | 'form' | 'detail' | 'text' | 'image' | 'container' | 'form_container' | 'form_text' | 'form_password' | 'form_checkbox' | 'form_multi_checkbox' | 'form_radio' | 'form_select' | 'form_file' | 'button' | 'pdf' | 'layout_2col' | 'layout_3col' | 'iframe';

export interface ComponentConfig {
  id: string;
  type: ComponentType;
  label?: string;
  apiId?: string; // Connected API
  props?: Record<string, any>;
  children?: ComponentConfig[];
}

export interface PageConfig {
  id: string;
  slug: string; // e.g., "todos" or "users/list"
  name: string;
  components: ComponentConfig[];
}

export interface SidebarItem {
  id: string;
  label: string;
  type: 'section' | 'link';
  pageId?: string; // For 'link' type
  children?: SidebarItem[]; // For 'section' type
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  scopes: string[]; // Array of sidebar item IDs the user can access
  createdAt: string;
}

export interface AppState {
  apis: ApiConfig[];
  pages: PageConfig[];
  sidebar: SidebarItem[];
  users: User[];
  settings: {
    theme: 'light' | 'dark';
    appTitle?: string;
    appIcon?: string;
  };
}
