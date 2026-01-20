// Types pour les services, actions et réactions AREA

export interface ActionParameter {
  name: string;
  type: string;
}

export interface Action {
  id?: number;
  name: string;
  description: string;
  params?: ActionParameter[];
  config_schema?: Record<string, any>;
}

export interface ReactionParameter {
  name: string;
  type: string;
}

export interface Reaction {
  id?: number;
  name: string;
  description: string;
  params?: ReactionParameter[];
  config_schema?: Record<string, any>;
}

export interface OAuthConfig {
  scopes?: string[];
  auth_url?: string;
  token_url?: string;
}

export interface Service {
  name: string;
  display_name: string;
  requires_oauth: boolean;
  is_connected?: boolean;
  is_active?: boolean;
  oauth_config: OAuthConfig;
  actions: Action[];
  reactions: Reaction[];
}

export interface ServerInfo {
  current_time: number;
  services: Service[];
}

export interface AboutResponse {
  client: {
    host: string;
  };
  server: ServerInfo;
}

// Types pour la création d'AREA
export interface AreaAction {
  service_name: string;
  action_name: string;
  params: Record<string, any>;
}

export interface AreaReaction {
  service_name: string;
  reaction_name: string;
  params: Record<string, any>;
}

export interface CreateAreaRequest {
  name: string;
  description?: string;
  action: AreaAction;
  reactions: AreaReaction[];
}