export const ROUTES = {
    HOME: "/home",
    SERVICES: "/list_discoverer",
    LOGIN: "/login",
    DISCOVERY:"/discoveries",
    REGISTER: "/register",
    PROFILE: "/profile",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SERVICES:"Первооткрыватели",
    LOGIN: "Авторизация",
    DISCOVERY:"Открытия",
    REGISTER: "Регистрация",
    PROFILE: "Личный кабинет",
}