import { NavigationStateType } from "../types/navigation-state.type";
export interface NavigateOptionsInterface {
    state?: NavigationStateType;
    replace?: boolean;
}
