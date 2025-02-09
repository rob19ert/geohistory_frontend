export const ROUTES = {
    HOME: "/home",
    SERVICES: "/list_discoverer",
    LOGIN: "/login",
    DISCOVERY:"/discoveries"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SERVICES:"Первооткрыватели",
    LOGIN: "Авторизация",
    DISCOVERY:"Открытия"
}